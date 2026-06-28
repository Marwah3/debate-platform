import sys
import json
import chromadb
from chromadb.utils import embedding_functions

def cari_konteks(teks_kueri):
    # 1. Hubungkan ke Chroma DB lokal 
    client = chromadb.PersistentClient(path="./chroma_data")
    
    # 2. Gunakan model embedding yang sama persis saat ingest data
    st_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    
    collection = client.get_or_create_collection(
        name="pedoman_debat_arel",
        embedding_function=st_ef
    )
    
    # 3. Cari 2 potongan teks (chunks) yang paling mirip dengan argumen mahasiswa
    results = collection.query(
        query_texts=[teks_kueri],
        n_results=2
    )
    
    # 4. Gabungkan potongan teks yang ditemukan menjadi satu string konteks
    konteks_ditemukan = " ".join(results['documents'][0])
    return konteks_ditemukan

if __name__ == "__main__":
    # Membaca argumen teks yang dikirim oleh Next.js via terminal string
    if len(sys.argv) > 1:
        kueri_input = sys.argv[1]
        hasil_konteks = cari_konteks(kueri_input)
        # Cetak hasil agar ditangkap oleh Node.js backend
        print(hasil_konteks)
    else:
        print("Kueri kosong.")