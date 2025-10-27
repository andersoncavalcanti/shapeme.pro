from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import Optional

# Ajuste o import conforme a localização real do seu arquivo/config
# Este exemplo assume backend/app/cloudinary_config.py com uma classe CloudinaryService
from ..cloudinary_config import CloudinaryService

router = APIRouter(
    prefix="/api",
    tags=["Uploads / Images"],
)

@router.post("/uploads/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Recebe um arquivo (multipart), envia ao Cloudinary e retorna:
    - public_id  -> para você salvar em recipes.image_url
    - thumbnail_url / medium_url / large_url -> para preview/uso imediato
    """
    try:
        content = await file.read()
        filename = (file.filename or "upload").rsplit(".", 1)[0]

        result = CloudinaryService.upload_image(content, filename)
        if not result or not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "Erro ao subir imagem"))

        public_id = result["public_id"]

        return {
            "public_id": public_id,
            "thumbnail_url": CloudinaryService.get_thumbnail_url(public_id),
            "medium_url": CloudinaryService.get_medium_url(public_id),
            "large_url": CloudinaryService.get_large_url(public_id),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/images/url")
def get_image_url(public_id: str = Query(...), size: Optional[str] = Query("medium")):
    """
    Gera uma URL otimizada para exibição (thumb/medium/large).
    Útil para renderizar imagens sem expor credenciais no frontend.
    """
    size = (size or "medium").lower()
    if size in ("thumb", "thumbnail"):
        url = CloudinaryService.get_thumbnail_url(public_id)
    elif size == "large":
        url = CloudinaryService.get_large_url(public_id)
    else:
        url = CloudinaryService.get_medium_url(public_id)

    if not url:
        raise HTTPException(status_code=400, detail="Não foi possível gerar a URL da imagem.")
    return {"url": url}

