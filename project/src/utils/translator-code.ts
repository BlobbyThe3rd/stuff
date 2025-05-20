// The Python code for the Derisian Translator as a string
export const pythonCode = "
  import random

# Maps
letter_map_en_to_derisian = {}
letter_map_derisian_to_en = {}
number_map_en_to_derisian = {}
number_map_derisian_to_en = {}
symbol_map_en_to_derisian = {}
symbol_map_derisian_to_en = {}

def setup_mappings():
    # --- Letter mapping (a-z) ---
    letters = list("abcdefghijklmnopqrstuvwxyz")
    derisian_letters = list("zyxwvutsrqponmlkjihgfedcba")  # Example: reversed alphabet

    global letter_map_en_to_derisian, letter_map_derisian_to_en
    letter_map_en_to_derisian = dict(zip(letters, derisian_letters))
    letter_map_derisian_to_en = {v: k for k, v in letter_map_en_to_derisian.items()}

    # --- Number mapping (0-9) ---
    numbers = list("0123456789")
    derisian_numbers = list("¢µþæøß¶§ð¿")  # 10 unique safe symbols

    global number_map_en_to_derisian, number_map_derisian_to_en
    number_map_en_to_derisian = dict(zip(numbers, derisian_numbers))
    number_map_derisian_to_en = {v: k for k, v in number_map_en_to_derisian.items()}

    # --- Symbol mapping (space and basic symbols) ---
    symbols = [" ", ".", ",", "!", "?", "'", '"', "(", ")", "-", "_", ":", ";", "/", "\\"]
    derisian_symbols = list("•`~!^@#&[]{}|=")[:len(symbols)]  # Unique safe symbols

    global symbol_map_en_to_derisian, symbol_map_derisian_to_en
    symbol_map_en_to_derisian = dict(zip(symbols, derisian_symbols))
    symbol_map_derisian_to_en = {v: k for k, v in symbol_map_en_to_derisian.items()}

def translate_char(c, direction="to_derisian"):
    is_upper = c.isupper()
    c_lower = c.lower()

    if direction == "to_derisian":
        if c_lower in letter_map_en_to_derisian:
            translated = letter_map_en_to_derisian[c_lower]
        elif c_lower in number_map_en_to_derisian:
            translated = number_map_en_to_derisian[c_lower]
        elif c_lower in symbol_map_en_to_derisian:
            translated = symbol_map_en_to_derisian[c_lower]
        else:
            translated = c  # Keep unknown characters

    else:  # to_english
        if c_lower in letter_map_derisian_to_en:
            translated = letter_map_derisian_to_en[c_lower]
        elif c_lower in number_map_derisian_to_en:
            translated = number_map_derisian_to_en[c_lower]
        elif c_lower in symbol_map_derisian_to_en:
            translated = symbol_map_derisian_to_en[c_lower]
        else:
            translated = c

    return translated.upper() if is_upper and translated.isalpha() else translated

def translate(text, direction="to_derisian"):
    return ''.join(translate_char(c, direction) for c in text)

def main():
    setup_mappings()

    print("\nWelcome to the Derisian Translator!")
    while True:
        choice = input("\nType '1' to translate English ➡️ Derisian\nType '2' to translate Derisian ➡️ English\nType 'q' to quit\n> ").strip()

        if choice == '1':
            text = input("\nEnter English word or phrase:\n> ")
            translated = translate(text, direction='to_derisian')
            print(f"\nDerisian: {translated}")

        elif choice == '2':
            text = input("\nEnter Derisian word or phrase:\n> ")
            translated = translate(text, direction='to_english')
            print(f"\nEnglish: {translated}")

        elif choice.lower() == 'q':
            print("\nGoodbye! ✌️")
            break

        else:
            print("\nInvalid option, try again.")

if __name__ == "__main__":
    main()
  "