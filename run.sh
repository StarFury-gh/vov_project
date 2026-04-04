cp backend/.env_example backend/.env
echo "Copied backend/.env_example -> backend/.env"

cp make_data/.env_example make_data/.env
echo "Copied make_data/.env_example -> make_data/.env"

echo "Rnning docker compose..."
docker compose up --build -d