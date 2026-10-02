class MaterialService:
    def __init__(self, material_repo):
        self.material_repo = material_repo

    async def get_latest_path(self, owner_type, owner_id, admin_id):
        return await self.material_repo.get_latest_path(owner_type, owner_id, admin_id)

    async def add_material(self, owner_type, owner_id, file_path, admin_id):
        return await self.material_repo.add_material(owner_type, owner_id, file_path, admin_id)
