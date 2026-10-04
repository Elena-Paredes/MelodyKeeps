using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MelodyKeeps.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDesignVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Variant",
                table: "Designs",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Variant",
                table: "Designs");
        }
    }
}
