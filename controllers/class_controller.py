class ClassController:
    def __init__(self, class_service):
        self.class_service = class_service

    async def create_class(self, class_document, admin_id):
        return await self.class_service.create_class(class_document, admin_id)

    async def get_class(self, class_id, admin_id):
        return await self.class_service.get_class(class_id, admin_id)

    async def get_all_classes(self, admin_id):
        return await self.class_service.get_all_classes(admin_id)

    async def search_classes(self, query, admin_id):
        return await self.class_service.search_classes(query, admin_id)

    async def update_class(self, class_id, admin_id, updates):
        return await self.class_service.update_class(class_id, admin_id, updates)

    async def delete_class(self, class_id, admin_id):
        return await self.class_service.delete_class(class_id, admin_id)