class MaterialController:
    def __init__(self, material_service):
        self.material_service = material_service

    async def get_latest_path(self, owner_type, owner_id, admin_id):
        return await self.material_service.get_latest_path(owner_type, owner_id, admin_id)

    async def add_material(self, owner_type, owner_id, file_path, admin_id):
        return await self.material_service.add_material(owner_type, owner_id, file_path, admin_id)
