#!/usr/bin/env python3
"""
Script para criar/atualizar um usuário administrador.
Coloque este arquivo em backend/app/create_admin.py e rode dentro do contêiner `backend`.
"""

import os
import sys
import argparse

# Ajuste de import para usar o package app do projeto
# Ele assume que você roda este script com cwd=/app (WORKDIR do container)
from sqlalchemy.orm import Session

try:
    # imports do próprio projeto
    from app.database import SessionLocal
    from app.models import User
    from app.security import get_password_hash
except Exception as e:
    print("Erro importando módulos do projeto. Certifique-se de executar o script dentro do container (WORKDIR /app).")
    print("Detalhe:", e)
    sys.exit(2)


def create_or_update_admin(email: str, name: str, password: str):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        hashed = get_password_hash(password)

        if user:
            print(f"[i] Usuário {email} já existe — atualizando senha e elevando para admin.")
            user.password = hashed if hasattr(user, "password") else None
            user.is_admin = True
            user.is_active = True
        else:
            print(f"[i] Criando novo usuário admin: {email}")
            # Se o model tiver coluna 'password' ou outra, ajustamos dinamicamente
            # Baseado no seu model (no projeto enviado a senha é armazenada em uma coluna 'password'?)
            # Caso seu model chame de 'hashed_password', ajuste abaixo.
            u = User(
                email=email,
                name=name,
                is_admin=True,
                is_active=True,
            )
            # adicionar senha se atributo existir
            if hasattr(u, "password"):
                setattr(u, "password", hashed)
            elif hasattr(u, "hashed_password"):
                setattr(u, "hashed_password", hashed)
            else:
                # tenta setar password mesmo que não exista (não quebra)
                setattr(u, "password", hashed)
            db.add(u)

        db.commit()
        print("[ok] Operação concluída com sucesso.")
    except Exception as e:
        db.rollback()
        print("[erro] Ao criar/atualizar usuário:", e)
        raise
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Criar/atualizar usuário admin no banco do ShapeMe")
    parser.add_argument("--email", "-e", required=True, help="Email do admin")
    parser.add_argument("--name", "-n", default="Admin", help="Nome do admin")
    parser.add_argument("--password", "-p", required=True, help="Senha do admin (texto plano)")
    args = parser.parse_args()

    # Confirmação (opcional)
    print(f"Criando/atualizando usuário admin: {args.email} / nome: {args.name}")
    create_or_update_admin(args.email, args.name, args.password)


if __name__ == "__main__":
    main()
