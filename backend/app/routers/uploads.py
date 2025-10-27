from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import Optional
from ..cloudinary_config import CloudinaryService  # ajuste caso necessário

router = APIRouter(
    prefix="/api",
    tags=["Uploads / Images"],
)

@router.post("/uploads/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Recebe um arquivo (multipart), envia ao Cloudinary e retorna:
    - public_id  -> salvar em recipes.image_url
    - thumbnail_url / medium_url / large_url -> para preview/uso imediato
    """
    try:
        if not file:
            raise ValueError("Arquivo não enviado (campo 'file').")

        content = await file.read()
        if not content:
            raise ValueError("Arquivo vazio.")

        filename = (file.filename or "upload").rsplit(".", 1)[0]
        content_type = file.content_type or "application/octet-stream"

        # Envia para seu serviço do Cloudinary (ajuste a assinatura se for diferente)
        result = CloudinaryService.upload_image(content, filename, content_type)

        if not result or not result.get("success"):
            # expõe o erro real para facilitar depuração
            reason = result.get("error") if isinstance(result, dict) else str(result)
            raise ValueError(reason or "Erro ao subir imagem no Cloudinary.")

        public_id = result["public_id"]
        return {
            "public_id": public_id,
            "thumbnail_url": CloudinaryService.get_thumbnail_url(public_id),
            "medium_url": CloudinaryService.get_medium_url(public_id),
            "large_url": CloudinaryService.get_large_url(public_id),
        }

    except Exception as e:
        # Garante que "detail" venha preenchido no 400
        msg = str(e) or "Falha no upload"
        raise HTTPException(status_code=400, detail=msg)


@router.get("/images/url")
def get_image_url(public_id: str = Query(...), size: Optional[str] = Query("medium")):
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
