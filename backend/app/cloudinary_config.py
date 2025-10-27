import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from typing import Optional
import uuid


# Configuração do Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryService:
    @staticmethod
    def upload_image(file_content: bytes, filename: str, folder: str = "shapeme/recipes") -> dict:
        """
        Upload de imagem para o Cloudinary
        """
        try:
            # Upload da imagem
            result = cloudinary.uploader.upload(
                file_content,
                folder=folder,
                #public_id=f"{filename}_{cloudinary.utils.generate_uuid()}",
                public_id = f"{filename}-{uuid.uuid4().hex[:8]}"  # gera um ID único e curto
                resource_type="image",
                format="webp",  # Converter para WebP para otimização
                quality="auto:good",  # Qualidade automática otimizada
                fetch_format="auto",  # Formato automático baseado no browser
                transformation=[
                    {"width": 800, "height": 600, "crop": "fill", "gravity": "auto"},
                    {"quality": "auto:good"},
                    {"fetch_format": "auto"}
                ]
            )
            
            return {
                "success": True,
                "public_id": result["public_id"],
                "secure_url": result["secure_url"],
                "width": result.get("width"),
                "height": result.get("height"),
                "format": result.get("format"),
                "bytes": result.get("bytes")
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def delete_image(public_id: str) -> dict:
        """
        Deletar imagem do Cloudinary
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            return {
                "success": True,
                "result": result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def get_optimized_url(public_id: str, width: int = 400, height: int = 300) -> str:
        """
        Gerar URL otimizada com transformações
        """
        try:
            url = cloudinary.utils.cloudinary_url(
                public_id,
                width=width,
                height=height,
                crop="fill",
                gravity="auto",
                quality="auto:good",
                fetch_format="auto",
                secure=True
            )[0]
            return url
        except Exception as e:
            return ""
    
    @staticmethod
    def get_thumbnail_url(public_id: str) -> str:
        """
        Gerar URL de thumbnail (pequena)
        """
        return CloudinaryService.get_optimized_url(public_id, width=200, height=150)
    
    @staticmethod
    def get_medium_url(public_id: str) -> str:
        """
        Gerar URL média
        """
        return CloudinaryService.get_optimized_url(public_id, width=400, height=300)
    
    @staticmethod
    def get_large_url(public_id: str) -> str:
        """
        Gerar URL grande
        """
        return CloudinaryService.get_optimized_url(public_id, width=800, height=600)