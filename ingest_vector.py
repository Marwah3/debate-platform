import os
import docx2txt
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from chromadb.utils import embedding_functions

print("=== Memulai Proses Ingest Dokumen ke Vector Database ===")

# 1. Tentukan path file Word materi kamu
word_file_path = "KONTEN DEBAT LENGKAP.docx"

if not os.path.exists(word_file_path):
    print(f"Error: File {word_file_path} tidak ditemukan di folder root project!")
    exit()

# 2. Ekstrak teks dari file Word
print("Loading teks dari file Word...")
text_mentah = docx2txt.process(word_file_path)

# 3. Proses Chunking
print("Memotong teks menjadi beberapa fragmen (chunking)...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,       
    chunk_overlap=100     
)
chunks = text_splitter.split_text(text_mentah)
print(f"Berhasil memecah materi menjadi {len(chunks)} potongan teks.")

# 4. Setup Database Vektor Lokal (Chroma DB)
print("Menginisialisasi Chroma DB lokal...")
client = chromadb.PersistentClient(path="./chroma_data")

# MENGGUNAKAN SENTENCE TRANSFORMERS (Jauh lebih stabil untuk internet naik-turun)
print("Menyiapkan model embedding (all-MiniLM-L6-v2)...")
st_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Membuat atau mengambil koleksi database
collection = client.get_or_create_collection(
    name="pedoman_debat_arel",
    embedding_function=st_ef
)

# 5. Memasukkan potongan materi ke dalam Vector Database
print("Memasukkan potongan teks dan menghasilkan vektor embedding ke Chroma...")
documents_list = []
metadatas_list = []
ids_list = []

for index, chunk in enumerate(chunks):
    documents_list.append(chunk)
    metadatas_list.append({"source": word_file_path, "chunk_index": index})
    ids_list.append(f"id_chunk_{index}")

# Push sekaligus ke Chroma DB
collection.add(
    documents=documents_list,
    metadatas=metadatas_list,
    ids=ids_list
)

print("=== PROSES SELESAI! Vector Database Chroma Berhasil Dibuat ===")
print("Folder './chroma_data' telah terisi koordinat materi debat kamu.")