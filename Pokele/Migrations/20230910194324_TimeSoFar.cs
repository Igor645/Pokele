using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokele.Migrations
{
    /// <inheritdoc />
    public partial class TimeSoFar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "timeSoFar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "timeSoFar",
                table: "Users");
        }
    }
}
