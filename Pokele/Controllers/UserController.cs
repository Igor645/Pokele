using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pokele;
using System.Security.Cryptography.Xml;
using System;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserDb _context;

    public UserController(UserDb context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetAllUsers")]
    public async Task<ActionResult<IEnumerable<User>>> Index()
    {
        var users = await _context.Users.ToListAsync();
        return users;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] UserCreateDto userDto)
    {
        if (userDto == null || string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Password))
        {
            return BadRequest("Invalid data.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
        if (existingUser != null)
        {
            return Conflict("User with the same username already exists.");
        }

        var user = new User
        {
            Username = userDto.Username,
            Password = userDto.Password,
            RecordTimes = new Dictionary<string, string>
        {
            { "all", "none" },
            { "gen-i", "none" },
            { "gen-ii", "none" },
            { "gen-iii", "none" },
            { "gen-iv", "none" },
            { "gen-v", "none" },
            { "gen-vi", "none" },
            { "gen-vii", "none" },
            { "gen-viii", "none" },
            { "gen-ix", "none" }
        },
            GuessedPokemon = new List<int>(),
            ChosenGeneration = "none",
            timeSoFar = "00:00:00"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Index), new { id = user.Id }, user);
    }

    [HttpPut("{id}/ChangeRecordTime")]
    public async Task<ActionResult<User>> ChangeRecordTime(int id, [FromBody] RecordTimeChangeDto recordTimeDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (recordTimeDto == null || string.IsNullOrWhiteSpace(recordTimeDto.Generation) || string.IsNullOrWhiteSpace(recordTimeDto.NewTime))
        {
            return BadRequest("Invalid data.");
        }

        if (!user.RecordTimes.ContainsKey(recordTimeDto.Generation))
        {
            return BadRequest("Invalid generation.");
        }

        if (user.RecordTimes[recordTimeDto.Generation] == "none" ||
            string.Compare(user.RecordTimes[recordTimeDto.Generation], recordTimeDto.NewTime) > 0)
        {
            user.RecordTimes[recordTimeDto.Generation] = recordTimeDto.NewTime;
            await _context.SaveChangesAsync();
            return Ok(user);
        }
        else
        {
            return BadRequest("New record time is not better than the current one.");
        }
    }


    [HttpPut("{id}/AddGuessedPokemon")]
    public async Task<ActionResult<User>> AddGuessedPokemon(int id, [FromBody] GuessedPokemonDto guessedPokemonDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (guessedPokemonDto == null || guessedPokemonDto.PokemonId <= 0)
        {
            return BadRequest("Invalid data.");
        }

        user.GuessedPokemon.Add(guessedPokemonDto.PokemonId);

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpGet("{id}/GetRecordTime")]
    public ActionResult<string> GetRecordTime(int id, [FromQuery] string generation)
    {
        var user = _context.Users.Find(id);

        if (user == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(generation) || !user.RecordTimes.ContainsKey(generation))
        {
            return BadRequest("Invalid generation.");
        }

        return Ok(user.RecordTimes[generation]);
    }

    [HttpGet("{id}/GetGuessedPokemon")]
    public ActionResult<List<int>> GetGuessedPokemon(int id)
    {
        var user = _context.Users.Find(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.GuessedPokemon);
    }

    [HttpPut("{id}/SetChosenGeneration")]
    public async Task<ActionResult<User>> SetChosenGeneration(int id, [FromBody] ChosenGenerationDto chosenGenerationDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (chosenGenerationDto == null || string.IsNullOrWhiteSpace(chosenGenerationDto.Generation))
        {
            return BadRequest("Invalid data.");
        }

        user.ChosenGeneration = chosenGenerationDto.Generation;

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpGet("{id}/GetChosenGeneration")]
    public ActionResult<string> GetChosenGeneration(int id)
    {
        var user = _context.Users.Find(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.ChosenGeneration);
    }

    [HttpPut("{id}/ResetToDefault")]
    public async Task<ActionResult<User>> ResetToDefault(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        user.RecordTimes = new Dictionary<string, string>
    {
        { "all", "none" },
        { "gen-i", "none" },
        { "gen-ii", "none" },
        { "gen-iii", "none" },
        { "gen-iv", "none" },
        { "gen-v", "none" },
        { "gen-vi", "none" },
        { "gen-vii", "none" },
        { "gen-viii", "none" },
        { "gen-ix", "none" }
    };
        user.GuessedPokemon = new List<int>();
        user.ChosenGeneration = "none";
        user.timeSoFar = "00:00:00";

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPut("{id}/ResetGuessedPokemon")]
    public async Task<ActionResult<User>> ResetGuessedPokemon(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        user.GuessedPokemon = new List<int>();
        user.ChosenGeneration = "none";

        await _context.SaveChangesAsync();

        return Ok(user);
    }


    [HttpPost("Login")]
    public async Task<ActionResult<User>> Login([FromBody] UserCreateDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null || loginDto.Password != user.Password)
        {
            return Unauthorized("Invalid username or password");
        }

        return Ok(user);
    }

    [HttpGet("{id}/GetTimeSoFar")]
    public async Task<ActionResult<string>> GetTimeSoFar(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.timeSoFar);
    }

    [HttpPut("{id}/SetTimeSoFar")]
    public async Task<ActionResult<User>> SetTimeSoFar(int id, [FromBody] TimeSoFarDto timeSoFarDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (timeSoFarDto == null || string.IsNullOrWhiteSpace(timeSoFarDto.Time))
        {
            return BadRequest("Invalid data.");
        }

        user.timeSoFar = timeSoFarDto.Time;

        await _context.SaveChangesAsync();

        return Ok(user);
    }

}







