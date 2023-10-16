using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokele.Migrations
{
    /// <inheritdoc />
    public partial class changesToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GuessedPokemon",
                table: "Users",
                newName: "GuessedPokemonJson");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GuessedPokemonJson",
                table: "Users",
                newName: "GuessedPokemon");
        }
    }
}
