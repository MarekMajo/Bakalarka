import os

directory = os.getcwd()

combined_filename = "combined_sql_files.txt"

with open(combined_filename, "w", encoding="utf-8") as combined_file:
    combined_file.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
    for filename in os.listdir(directory):
        if filename.endswith(".sql"):
            with open(filename, "r", encoding="utf-8") as file:
                content = file.read()
                combined_file.write(content + "\n\n")

    combined_file.write("SET FOREIGN_KEY_CHECKS = 1;")

print(f"Všetky .sql súbory boli kombinované do súboru '{combined_filename}'.")
