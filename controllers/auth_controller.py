class AuthController:
    def __init__(self, auth_service):
        self.auth_service = auth_service

    async def login_with_google(self, profile):
        return await self.auth_service.login_with_google(profile)
        
    async def login(self, email: str, password: str):
        return await self.auth_service.login(email, password)
