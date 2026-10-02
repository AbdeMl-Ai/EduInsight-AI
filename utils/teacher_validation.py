class TeacherValidator:

    @staticmethod
    def validate_name(full_name):
        full_name = full_name.strip()
        if not full_name:
            raise ValueError("full name cannot be empty")
        if len(full_name) < 3:
            raise ValueError("Full name must contain as least 3 characters.")
        if len(full_name) > 100:
            raise ValueError("Full name must not exceed 100 characters.")
        if not all(char.isalpha() or char.isspace() for char in full_name):
            raise ValueError("Full name must contain only letters and spaces")
    @staticmethod
    def validate_email(email):
        email = email.strip()            
        if not email:
            raise ValueError("email cannot be empty")
        if "@" not in email or "." not in email:
            raise ValueError("Email must contrain '@'ro '.'.")
        if email.count("@") != 1:
            raise ValueError("Invalid email address.")
    @staticmethod  
    def validate_phone_number(phone_number):
        phone_number = phone_number.strip()
        if not phone_number:
            raise ValueError("Phone number cannot be empty")
        if phone_number.startswith("+"):
            digits = phone_number[1:]
            if not digits.isdigit() or not 8 <= len(digits) <= 15:
                raise ValueError("Phone number must use a valid international format.")
        elif not phone_number.isdigit() or len(phone_number) != 10:
            raise ValueError("Phone number not correct size.")

