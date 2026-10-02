class ParentController:
    def __init__(self, parent_service):
        self.parent_service = parent_service

    async def create_parent(self, full_name, email, contact_number, admin_id, student_ids=None):
        return await self.parent_service.create_parent(full_name, email, contact_number, admin_id, student_ids)

    async def get_parent(self, parent_id, admin_id):
        return await self.parent_service.get_parent(parent_id, admin_id)

    async def get_all_parents(self, admin_id):
        return await self.parent_service.get_all_parents(admin_id)

    async def update_parent(self, parent_id, admin_id, updates):
        return await self.parent_service.update_parent(parent_id, admin_id, updates)

    async def add_student(self, parent_id, student_id, admin_id):
        return await self.parent_service.add_student(parent_id, student_id, admin_id)

    async def delete_parent(self, parent_id, admin_id):
        return await self.parent_service.delete_parent(parent_id, admin_id)
