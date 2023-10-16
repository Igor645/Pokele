using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Pokele
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        [NotMapped] // This property won't be mapped to the database
        public Dictionary<string, string> RecordTimes { get; set; }

        [Column("RecordTimesJson")]
        public string RecordTimesJson
        {
            get => JsonConvert.SerializeObject(RecordTimes);
            set => RecordTimes = JsonConvert.DeserializeObject<Dictionary<string, string>>(value);
        }

        [NotMapped] // This property won't be mapped to the database
        public List<int> GuessedPokemon { get; set; }

        [Column("GuessedPokemonJson")]
        public string GuessedPokemonJson
        {
            get => JsonConvert.SerializeObject(GuessedPokemon);
            set => GuessedPokemon = JsonConvert.DeserializeObject<List<int>>(value);
        }

        public string ChosenGeneration { get; set; }
        public string timeSoFar {  get; set; }
    }
}
