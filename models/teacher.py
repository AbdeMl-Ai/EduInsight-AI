class Teacher:
    def __init__(self, teacher_id, full_name, email, phone_number, classes=None, admin_id=None, organization_id=None):
            self.teacher_id = teacher_id
            self.full_name = full_name
            self.email = email
            self.phone_number = phone_number
            self.classes = classes or []
            self.admin_id = admin_id
            self.organization_id = organization_id
