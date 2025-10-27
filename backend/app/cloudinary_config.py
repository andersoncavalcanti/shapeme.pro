import os
import re
import uuid
import cloudinary
from cloudinary.uploader import upload
from cloudinary import CloudinaryImage

# Configuração a partir das variáveis de ambiente
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def _slugify(value: str) -> str:
    """
    Slug simples pra compor o public_id.
    """
    value = value or "upload"
    value = value.strip().lower()
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    value = re.sub(r"^-+|-+$", "", value)
    return value or "upload"

class CloudinaryService:
    """
    Serviço utilitário para upload e geração de URLs transformadas.
    Armazene no banco apenas o public_id retornado.
    """

    @staticmethod
    def upload_image(content: bytes, filename: str = "upload", content_type: str | None = None) -> dict:
        """
        Envia a imagem (bytes) para o Cloudinary.
        Retorno: {"success": True, "public_id": "..."} ou {"success": False, "error": "..."}
        """
        try:
            if not content:
                return {"success": False, "error": "Conteúdo do arquivo vazio."}

            base = _slugify(filename)
            unique = uuid.uuid4().hex  # << corrige o 'generate_uuid' inexistente
            public_id = f"recipes/{base}-{unique}"

            # Upload por bytes (resource_type='image' detecta automaticamente)
            result = upload(
                content,
                public_id=public_id,
                overwrite=True,
                resource_type="image",
                # Você pode forçar formatação/qualidade no upload, porém recomendo via URL transform:
                # format="jpg"
            )

            return {"success": True, "public_id": result.get("public_id")}
        except Exception as e:
            return {"success": False, "error": str(e)}

    # ---------- URLs transformadas (economia de banda) ----------

    @staticmethod
    def get_thumbnail_url(public_id: str) -> str:
        """
        Miniatura 160x160, recorte 'fill', gravidade automática, q_auto/f_auto.
        """
        if not public_id:
            return ""
        try:
            return CloudinaryImage(public_id).build_url(
                transformation=[
                    {
                        "width": 160,
                        "height": 160,
                        "crop": "fill",
                        "gravity": "auto",
                        "quality": "auto",
                        "fetch_format": "auto",
                    }
                ]
            )
        except Exception:
            return ""

    @staticmethod
    def get_medium_url(public_id: str) -> str:
        """
        Imagem média 800px largura, mantém proporção (crop 'limit'), q_auto/f_auto.
        """
        if not public_id:
            return ""
        try:
            return CloudinaryImage(public_id).build_url(
                transformation=[
                    {
                        "width": 800,
                        "crop": "limit",
                        "quality": "auto",
                        "fetch_format": "auto",
                    }
                ]
            )
        except Exception:
            return ""

    @staticmethod
    def get_large_url(public_id: str) -> str:
        """
        Imagem grande 1280px largura, mantém proporção (crop 'limit'), q_auto/f_auto.
        """
        if not public_id:
            return ""
        try:
            return CloudinaryImage(public_id).build_url(
                transformation=[
                    {
                        "width": 1280,
                        "crop": "limit",
                        "quality": "auto",
                        "fetch_format": "auto",
                    }
                ]
            )
        except Exception:
            return ""
