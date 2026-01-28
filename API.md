# API Documentation - NAKES / JagoanBunda

Dokumentasi API untuk backend aplikasi mobile **NAKES / JagoanBunda**. Aplikasi ini digunakan untuk pelacakan kesehatan anak, pemantauan pertumbuhan, dan skrining perkembangan.

> **Last Updated**: 2026-01-27  
> **Total Endpoints**: 50 endpoints

## Dasar (Base URL)

Semua endpoint API diawali dengan path berikut:
```text
/api/v1
```

## Autentikasi

Aplikasi ini menggunakan **Laravel Sanctum** untuk autentikasi dengan model **Dual Authentication**:

### Model Dual Authentication

| Tipe Pengguna | Channel | Metode Autentikasi |
|---------------|---------|-------------------|
| **Parent (Orang Tua)** | API Only (Mobile App) | Token Sanctum |
| **Nakes (Tenaga Kesehatan)** | Web Only (Dashboard) | Session Laravel |

**Penting:**
- **Parent** hanya dapat login melalui API `/api/v1/auth/login`. Percobaan login via web akan ditolak.
- **Nakes** hanya dapat login melalui web `/login`. Percobaan login via API akan ditolak dengan error code `NAKES_WEB_ONLY`.
- Registrasi Nakes dilakukan oleh admin (seeder/phpMyAdmin), bukan self-registration.

### Mendapatkan Token (Khusus Parent)
Token diperoleh melalui endpoint `/auth/login` atau `/auth/register`. Endpoint ini **hanya untuk pengguna Parent** (aplikasi mobile).

### Menggunakan Token
Sertakan token dalam header `Authorization` pada setiap permintaan yang memerlukan autentikasi:

```text
Authorization: Bearer {your_access_token}
```

### Error Cross-Authentication

| Error Code | HTTP Status | Situasi |
|------------|-------------|---------|
| `NAKES_WEB_ONLY` | 403 | Nakes mencoba login via API |
| `PARENT_API_ONLY` | 403 | Parent dengan token mencoba akses API tapi user_type bukan parent |

**Contoh Response Error:**
```json
{
  "message": "Akun tenaga kesehatan hanya dapat login melalui web.",
  "error_code": "NAKES_WEB_ONLY"
}
```

## Format Respon Kesalahan

Permintaan yang gagal akan mengembalikan kode status HTTP yang sesuai (4xx atau 5xx) dan badan respon JSON dengan pesan kesalahan.

### Kesalahan Umum
```json
{
  "message": "Pesan kesalahan yang menjelaskan apa yang salah."
}
```

### Kesalahan Validasi (422)
```json
{
  "message": "Data yang diberikan tidak valid.",
  "errors": {
    "field_name": [
      "Pesan kesalahan validasi pertama",
      "Pesan kesalahan validasi kedua"
    ]
  }
}
```

## Daftar Endpoint

---

### Autentikasi (`/auth`)

#### POST /auth/register
Mendaftarkan pengguna baru **sebagai Parent** (orang tua). Endpoint ini khusus untuk aplikasi mobile.

- **Autentikasi Diperlukan:** Tidak
- **Catatan:** Registrasi ini hanya membuat akun Parent (`user_type: 'parent'`). Nakes didaftarkan oleh admin.
- **Parameter Body:**
  - `name` (string, required): Nama lengkap pengguna. Max 255 karakter.
  - `email` (string, required): Alamat email unik.
  - `password` (string, required): Minimal 8 karakter.
  - `password_confirmation` (string, required): Harus sama dengan password.
  - `phone` (string, optional): Nomor telepon pengguna. Max 20 karakter.
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Registrasi berhasil",
    "user": {
      "id": 1,
      "name": "Bunda Hebat",
      "email": "bunda@example.com",
      "phone": "08123456789",
      "avatar_url": null,
      "user_type": "parent",
      "push_notifications": true,
      "weekly_report": true,
      "email_verified_at": null,
      "created_at": "2026-01-17T10:00:00+00:00"
    },
    "token": "1|abcdef123456..."
  }
  ```

#### POST /auth/login
Masuk ke aplikasi dan mendapatkan token akses. **Khusus untuk pengguna Parent**.

- **Autentikasi Diperlukan:** Tidak
- **Catatan:** Nakes tidak dapat login via API. Mereka harus login via web `/login`.
- **Parameter Body:**
  - `email` (string, required): Email terdaftar.
  - `password` (string, required): Password akun.
  - `revoke_others` (boolean, optional): Jika true, semua token aktif lainnya akan dihapus.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Login berhasil",
    "user": {
      "id": 1,
      "name": "Bunda Hebat",
      "email": "bunda@example.com",
      "phone": "08123456789",
      "avatar_url": null,
      "user_type": "parent",
      "push_notifications": true,
      "weekly_report": true,
      "email_verified_at": "2026-01-17T10:00:00+00:00",
      "created_at": "2026-01-17T10:00:00+00:00"
    },
    "token": "2|ghjkl7890..."
  }
  ```
- **Respon Gagal - Nakes mencoba login (403 Forbidden):**
  ```json
  {
    "message": "Akun tenaga kesehatan hanya dapat login melalui web.",
    "error_code": "NAKES_WEB_ONLY"
  }
  ```

#### POST /auth/logout
Mengakhiri sesi dan mencabut token saat ini.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Logout berhasil"
  }
  ```

#### POST /auth/refresh
Mencabut token saat ini dan membuat token baru.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Token berhasil diperbarui",
    "token": "3|qwertyuiop..."
  }
  ```

#### GET /auth/me
Mendapatkan profil pengguna yang sedang login.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "user": {
      "id": 1,
      "name": "Bunda Hebat",
      "email": "bunda@example.com",
      "phone": "08123456789",
      "avatar_url": null,
      "user_type": "parent",
      "push_notifications": true,
      "weekly_report": true,
      "email_verified_at": "2026-01-17T10:00:00+00:00",
      "created_at": "2026-01-17T10:00:00+00:00"
    }
  }
  ```

#### PUT /auth/profile
Memperbarui profil pengguna.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `name` (string, optional): Max 255 karakter.
  - `phone` (string, optional): Max 20 karakter.
  - `avatar_url` (url, optional): Max 500 karakter.
  - `push_notifications` (boolean, optional)
  - `weekly_report` (boolean, optional)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Profil berhasil diperbarui",
    "user": { ... }
  }
  ```

---

### Anak (`/children`)

#### GET /children
Mendapatkan daftar anak yang dimiliki pengguna.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `active_only` (any, optional): Jika ada, hanya menampilkan anak yang aktif.
- **Respon Berhasil (200 OK):**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "name": "Si Buah Hati",
      "birthday": "2024-01-01",
      "gender": "male",
      "avatar_url": "https://example.com/photo.jpg",
      "birth_weight": 3.2,
      "birth_height": 50.0,
      "head_circumference": 35.0,
      "is_active": true,
      "age": {
        "months": 24,
        "days": 730,
        "label": "2 tahun"
      },
      "created_at": "2024-01-01T00:00:00+00:00",
      "updated_at": "2026-01-17T10:00:00+00:00"
    }
  ]
  ```

#### POST /children
Menambahkan data anak baru.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `name` (string, required): Max 255 karakter.
  - `birthday` (date, required): Format YYYY-MM-DD. Tidak boleh di masa depan.
  - `gender` (string, required): `male`, `female`, atau `other`.
  - `avatar_url` (url, optional): Max 500 karakter.
  - `birth_weight` (numeric, optional): Dalam kg (0.5 - 10).
  - `birth_height` (numeric, optional): Dalam cm (20 - 70).
  - `head_circumference` (numeric, optional): Dalam cm (20 - 50).
  - `is_active` (boolean, optional): Default true.
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Data anak berhasil ditambahkan",
    "child": { ... }
  }
  ```

#### GET /children/{child}
Mendapatkan detail data anak.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "child": {
      "id": 1,
      "user_id": 1,
      "name": "Si Buah Hati",
      "birthday": "2024-01-01",
      "gender": "male",
      "avatar_url": null,
      "birth_weight": 3.2,
      "birth_height": 50.0,
      "head_circumference": 35.0,
      "is_active": true,
      "age": {
        "months": 24,
        "days": 730,
        "label": "2 tahun"
      },
      "created_at": "2024-01-01T00:00:00+00:00",
      "updated_at": "2026-01-17T10:00:00+00:00"
    }
  }
  ```

#### PUT /children/{child}
Memperbarui data anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:** Sama dengan POST /children (semua bersifat opsional).
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Data anak berhasil diperbarui",
    "child": { ... }
  }
  ```

#### DELETE /children/{child}
Menghapus data anak (soft delete).

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Data anak berhasil dihapus"
  }
  ```

#### GET /children/{child}/summary
Mendapatkan ringkasan kesehatan anak termasuk pengukuran terakhir dan skrining terbaru.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "child": { ... },
    "age": {
      "months": 24,
      "days": 730
    },
    "latest_measurement": {
      "date": "2025-12-30",
      "weight": 12.5,
      "height": 85.0,
      "nutritional_status": "Gizi Baik",
      "stunting_status": "Normal",
      "wasting_status": "Gizi Baik"
    },
    "latest_screening": {
      "date": "2025-11-15",
      "overall_status": "sesuai"
    },
    "today_nutrition": {
      "calories": 450.5,
      "protein": 15.2,
      "carbohydrate": 60.0,
      "fat": 12.5
    }
  }
  ```

---

### Antropometri (`/children/{child}/anthropometry`)

#### GET /children/{child}/anthropometry
Daftar riwayat pengukuran pertumbuhan anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `per_page` (integer, optional): Default 20.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "child_id": 1,
        "measurement_date": "2025-12-30",
        "weight": 12.5,
        "height": 85.0,
        "head_circumference": 48.0,
        "bmi": 17.3,
        "is_lying": false,
        "measurement_location": "posyandu",
        "z_scores": {
          "weight_for_age": 0.5,
          "height_for_age": -0.2,
          "weight_for_height": 0.8,
          "bmi_for_age": 0.6,
          "head_circumference": 0.3
        },
        "status": {
          "nutritional": "Gizi Baik",
          "stunting": "Normal",
          "wasting": "Gizi Baik"
        },
        "notes": "Pengukuran rutin bulanan",
        "created_at": "2025-12-30T10:00:00+00:00"
      }
    ],
    "links": { ... },
    "meta": { ... }
  }
  ```

#### POST /children/{child}/anthropometry
Mencatat pengukuran baru. Z-Score dan status gizi akan dihitung otomatis berdasarkan standar WHO.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `measurement_date` (date, required): Format YYYY-MM-DD. Tidak boleh di masa depan.
  - `weight` (numeric, required): Dalam kg (1 - 100).
  - `height` (numeric, required): Dalam cm (30 - 200).
  - `head_circumference` (numeric, optional): Dalam cm (20 - 60).
  - `is_lying` (boolean, optional): Pengukuran dilakukan sambil berbaring.
  - `measurement_location` (string, optional): `posyandu`, `home`, `clinic`, `hospital`, `other`.
  - `notes` (string, optional): Max 1000 karakter.
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Data pengukuran berhasil ditambahkan",
    "measurement": { ... }
  }
  ```

#### GET /children/{child}/anthropometry/{anthropometry}
Mendapatkan detail satu catatan pengukuran.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "measurement": { ... }
  }
  ```

#### PUT /children/{child}/anthropometry/{anthropometry}
Memperbarui catatan pengukuran. Z-Score akan dihitung ulang.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:** Sama dengan POST (semua opsional).
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Data pengukuran berhasil diperbarui",
    "measurement": { ... }
  }
  ```

#### DELETE /children/{child}/anthropometry/{anthropometry}
Menghapus catatan pengukuran.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Data pengukuran berhasil dihapus"
  }
  ```

#### GET /children/{child}/growth-chart
Mendapatkan data untuk grafik pertumbuhan (berat/usia, tinggi/usia, BMI/usia).

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "child": {
      "id": 1,
      "name": "Si Buah Hati",
      "gender": "male",
      "birthday": "2024-01-01"
    },
    "measurements": [
      {
        "date": "2025-12-30",
        "age_months": 24,
        "weight": 12.5,
        "height": 85.0,
        "head_circumference": 48.0,
        "weight_for_age_zscore": 0.5,
        "height_for_age_zscore": -0.2,
        "weight_for_height_zscore": 0.8
      }
    ]
  }
  ```

---

### Makanan (`/foods`)

#### GET /foods
Mendapatkan daftar makanan (sistem + custom pengguna).

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `search` (string, optional): Cari berdasarkan nama.
  - `category` (string, optional): Filter kategori.
  - `per_page` (integer, optional): Default 50.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Nasi Putih",
        "category": "Karbohidrat",
        "icon": "rice",
        "serving_size": 100,
        "nutrition": {
          "calories": 130,
          "protein": 2.7,
          "fat": 0.3,
          "carbohydrate": 28.2,
          "fiber": 0.4,
          "sugar": 0.0
        },
        "is_system": true,
        "is_active": true
      }
    ],
    "links": { ... },
    "meta": { ... }
  }
  ```

#### POST /foods
Membuat data makanan kustom sendiri.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `name` (string, required): Max 255 karakter.
  - `category` (string, required): Max 100 karakter.
  - `icon` (string, optional): Max 100 karakter.
  - `serving_size` (numeric, required): Ukuran porsi dalam gram (min: 1).
  - `calories` (numeric, required): Dalam kkal (min: 0).
  - `protein` (numeric, required): Dalam gram (min: 0).
  - `fat` (numeric, required): Dalam gram (min: 0).
  - `carbohydrate` (numeric, required): Dalam gram (min: 0).
  - `fiber` (numeric, optional): Dalam gram (min: 0).
  - `sugar` (numeric, optional): Dalam gram (min: 0).
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Makanan berhasil ditambahkan",
    "food": { ... }
  }
  ```

#### GET /foods/{food}
Detail makanan.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "food": { ... }
  }
  ```

#### PUT /foods/{food}
Memperbarui makanan kustom (hanya untuk makanan buatan sendiri).

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:** Sama dengan POST (semua opsional).
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Makanan berhasil diperbarui",
    "food": { ... }
  }
  ```
- **Respon Gagal (403 Forbidden):**
  ```json
  {
    "message": "Anda tidak dapat mengubah makanan ini"
  }
  ```

#### DELETE /foods/{food}
Menghapus makanan kustom (hanya untuk makanan buatan sendiri, soft delete via is_active=false).

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Makanan berhasil dihapus"
  }
  ```

#### GET /foods-categories
Mendapatkan daftar semua kategori makanan yang tersedia.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "categories": ["Karbohidrat", "Protein", "Sayuran", "Buah", "Susu"]
  }
  ```

---

### Log Makanan (`/children/{child}/food-logs`)

#### GET /children/{child}/food-logs
Daftar riwayat makan anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `start_date` (date, optional): Format YYYY-MM-DD.
  - `end_date` (date, optional): Format YYYY-MM-DD.
  - `meal_time` (string, optional): `breakfast`, `lunch`, `dinner`, `snack`.
  - `per_page` (integer, optional): Default 20.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "child_id": 1,
        "log_date": "2026-01-17",
        "meal_time": "breakfast",
        "meal_time_label": "Sarapan",
        "totals": {
          "calories": 350.0,
          "protein": 12.5,
          "fat": 8.0,
          "carbohydrate": 55.0
        },
        "items": [
          {
            "id": 1,
            "food": {
              "id": 1,
              "name": "Bubur Ayam",
              "category": "Makanan Utama",
              "icon": "bowl"
            },
            "quantity": 1.0,
            "serving_size": 200.0,
            "nutrition": {
              "calories": 350.0,
              "protein": 12.5,
              "fat": 8.0,
              "carbohydrate": 55.0
            }
          }
        ],
        "notes": "Anak lahap makan pagi ini",
        "created_at": "2026-01-17T07:00:00+00:00"
      }
    ],
    "links": { ... },
    "meta": { ... }
  }
  ```

#### POST /children/{child}/food-logs
Mencatat aktivitas makan.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `log_date` (date, required): Format YYYY-MM-DD.
  - `meal_time` (string, required): `breakfast`, `lunch`, `dinner`, `snack`.
  - `notes` (string, optional): Max 1000 karakter.
  - `items` (array, required): Minimal 1 item.
    - `items[].food_id` (integer, required): ID makanan yang ada.
    - `items[].quantity` (numeric, required): Jumlah porsi (0.1 - 100).
    - `items[].serving_size` (numeric, optional): Ukuran porsi kustom dalam gram (min: 1).
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Log makanan berhasil ditambahkan",
    "food_log": { ... }
  }
  ```

#### GET /children/{child}/food-logs/{foodLog}
Detail log makanan tertentu.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "food_log": { ... }
  }
  ```

#### PUT /children/{child}/food-logs/{foodLog}
Memperbarui log makanan. Jika `items` diberikan, item lama akan dihapus dan diganti.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `log_date` (date, optional)
  - `meal_time` (string, optional)
  - `notes` (string, optional)
  - `items` (array, optional): Jika diberikan, akan mengganti seluruh items.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Log makanan berhasil diperbarui",
    "food_log": { ... }
  }
  ```

#### DELETE /children/{child}/food-logs/{foodLog}
Menghapus log makanan beserta semua itemnya.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Log makanan berhasil dihapus"
  }
  ```

#### GET /children/{child}/nutrition-summary
Mendapatkan ringkasan asupan nutrisi untuk periode tertentu.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `period` (string, optional): `day`, `week`, `month`. Default `day`.
  - `date` (date, optional): Tanggal acuan. Default hari ini.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "period": "day",
    "start_date": "2026-01-17",
    "end_date": "2026-01-17",
    "total_meals": 3,
    "totals": {
      "calories": 1200.5,
      "protein": 45.0,
      "fat": 35.0,
      "carbohydrate": 165.0
    },
    "by_meal_time": {
      "breakfast": {
        "count": 1,
        "calories": 350.0,
        "protein": 12.5,
        "fat": 8.0,
        "carbohydrate": 55.0
      },
      "lunch": { ... },
      "dinner": { ... }
    },
    "daily_average": {
      "calories": 1200.5,
      "protein": 45.0,
      "fat": 35.0,
      "carbohydrate": 165.0
    }
  }
  ```
  > **Catatan:** `daily_average` hanya muncul untuk period `week` atau `month`.

---

### ASQ-3 Data Master (`/asq3`)

#### GET /asq3/domains
Daftar ranah perkembangan dalam ASQ-3 (Komunikasi, Motorik Kasar, dll).

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "domains": [
      {
        "id": 1,
        "code": "communication",
        "name": "Komunikasi",
        "color": "#4CAF50",
        "display_order": 1
      }
    ]
  }
  ```

#### GET /asq3/age-intervals
Daftar interval usia untuk kuesioner ASQ-3.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "age_intervals": [
      {
        "id": 1,
        "age_months": 24,
        "age_label": "24 Bulan",
        "min_days": 683,
        "max_days": 773
      }
    ]
  }
  ```

#### GET /asq3/age-intervals/{interval}/questions
Daftar pertanyaan untuk interval usia tertentu, dikelompokkan berdasarkan domain.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "age_interval": {
      "id": 1,
      "age_months": 24,
      "age_label": "24 Bulan"
    },
    "questions_by_domain": {
      "communication": [
        {
          "id": 1,
          "question_text": "Apakah anak dapat menyebutkan namanya?",
          "domain_id": 1,
          "display_order": 1,
          "domain": { ... }
        }
      ],
      "gross_motor": [ ... ]
    },
    "cutoffs": {
      "communication": {
        "cutoff_score": 25.0,
        "monitoring_score": 35.0,
        "domain": { ... }
      }
    },
    "total_questions": 30
  }
  ```

#### GET /asq3/recommendations
Daftar rekomendasi berdasarkan hasil skrining.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `domain_id` (integer, optional): Filter berdasarkan domain.
  - `age_interval_id` (integer, optional): Filter berdasarkan interval usia.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "recommendations": [
      {
        "id": 1,
        "domain_id": 1,
        "age_interval_id": null,
        "title": "Stimulasi Komunikasi",
        "description": "Ajak anak berbicara lebih sering...",
        "priority": 1,
        "domain": { ... },
        "ageInterval": null
      }
    ]
  }
  ```

---

### Skrining ASQ-3 (`/children/{child}/screenings`)

#### GET /children/{child}/screenings
Riwayat skrining perkembangan anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `per_page` (integer, optional): Default 20.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "screenings": [
      {
        "id": 1,
        "child_id": 1,
        "screening_date": "2025-11-15",
        "age_at_screening": {
          "months": 24,
          "days": 730
        },
        "age_interval": {
          "id": 1,
          "age_months": 24,
          "age_label": "24 Bulan"
        },
        "status": "completed",
        "status_label": "Selesai",
        "overall_status": "sesuai",
        "overall_status_label": "Perkembangan Sesuai",
        "completed_at": "2025-11-15T10:30:00+00:00",
        "answers_count": 30,
        "results": [ ... ],
        "notes": null,
        "created_at": "2025-11-15T10:00:00+00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1
    }
  }
  ```

#### POST /children/{child}/screenings
Memulai sesi skrining baru. Sistem akan otomatis memilih kuesioner berdasarkan usia anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `screening_date` (date, optional): Default hari ini.
  - `notes` (string, optional)
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Screening baru berhasil dibuat",
    "screening": {
      "id": 5,
      "child_id": 1,
      "screening_date": "2026-01-17",
      "status": "in_progress",
      "status_label": "Sedang Dikerjakan",
      "age_interval": {
        "id": 1,
        "age_months": 24,
        "age_label": "24 Bulan"
      }
    }
  }
  ```
- **Respon Gagal (422 Unprocessable Entity):**
  ```json
  {
    "message": "Tidak ada kuesioner yang sesuai untuk usia anak"
  }
  ```

#### GET /children/{child}/screenings/{screening}
Detail sesi skrining termasuk jawaban dan hasil.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "screening": {
      "id": 1,
      "child_id": 1,
      "screening_date": "2025-11-15",
      "age_at_screening": {
        "months": 24,
        "days": 730
      },
      "age_interval": { ... },
      "status": "completed",
      "status_label": "Selesai",
      "overall_status": "sesuai",
      "overall_status_label": "Perkembangan Sesuai",
      "completed_at": "2025-11-15T10:30:00+00:00",
      "answers_count": 30,
      "results": [
        {
          "domain": {
            "code": "communication",
            "name": "Komunikasi",
            "color": "#4CAF50"
          },
          "total_score": 55.0,
          "cutoff_score": 25.0,
          "monitoring_score": 35.0,
          "status": "sesuai",
          "status_label": "Sesuai Harapan"
        }
      ],
      "notes": null,
      "created_at": "2025-11-15T10:00:00+00:00"
    }
  }
  ```

#### PUT /children/{child}/screenings/{screening}
Memperbarui informasi atau status skrining.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `notes` (string, optional)
  - `status` (string, optional): `in_progress`, `cancelled`. Tidak dapat mengubah jika sudah `completed`.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Screening berhasil diperbarui",
    "screening": { ... }
  }
  ```
- **Respon Gagal (422 Unprocessable Entity):**
  ```json
  {
    "message": "Screening sudah selesai dan tidak dapat diubah"
  }
  ```

#### POST /children/{child}/screenings/{screening}/answers
Mengirim jawaban untuk pertanyaan skrining. Jika semua pertanyaan terjawab, status akan berubah menjadi `completed` secara otomatis dan hasil akan dihitung.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `answers` (array, required): Minimal 1 jawaban.
    - `answers[].question_id` (integer, required): ID pertanyaan.
    - `answers[].answer` (string, required): `yes`, `sometimes`, `no`.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Jawaban berhasil disimpan",
    "screening": { ... }
  }
  ```

#### GET /children/{child}/screenings/{screening}/results
Mendapatkan hasil interpretasi skor skrining beserta rekomendasi.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "screening": {
      "id": 1,
      "date": "2025-11-15",
      "age_at_screening": 24,
      "status": "completed",
      "overall_status": "sesuai"
    },
    "results": [
      {
        "domain": {
          "code": "communication",
          "name": "Komunikasi",
          "color": "#4CAF50"
        },
        "total_score": 55.0,
        "cutoff_score": 25.0,
        "monitoring_score": 35.0,
        "status": "sesuai",
        "status_label": "Sesuai Harapan"
      }
    ],
    "recommendations": [
      {
        "id": 1,
        "domain_id": 2,
        "title": "Stimulasi Motorik Kasar",
        "description": "...",
        "priority": 1,
        "domain": { ... }
      }
    ]
  }
  ```

**Status Interpretasi:**
| Status | Label | Arti |
|--------|-------|------|
| `sesuai` | Sesuai Harapan | Skor di atas monitoring score |
| `pantau` | Perlu Pemantauan | Skor antara cutoff dan monitoring |
| `perlu_rujukan` | Perlu Rujukan | Skor di bawah cutoff score |

---

### PMT (Pemberian Makanan Tambahan) (`/pmt`)

#### GET /pmt/menus
Daftar menu PMT yang tersedia.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `age_months` (integer, optional): Filter menu berdasarkan usia anak dalam bulan.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "menus": [
      {
        "id": 1,
        "name": "Bubur Kacang Hijau",
        "description": "Bubur kacang hijau bergizi tinggi",
        "image_url": "https://example.com/menu.jpg",
        "nutrition": {
          "calories": 250.0,
          "protein": 8.5
        },
        "age_range": {
          "min_months": 6,
          "max_months": 24
        },
        "is_active": true
      }
    ]
  }
  ```

#### GET /children/{child}/pmt-schedules
Daftar jadwal PMT untuk anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `start_date` (date, optional): Default awal bulan ini.
  - `end_date` (date, optional): Default akhir bulan ini.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "schedules": [
      {
        "id": 1,
        "child_id": 1,
        "scheduled_date": "2026-01-17",
        "is_logged": true,
        "menu": {
          "id": 1,
          "name": "Bubur Kacang Hijau",
          "image_url": "https://example.com/menu.jpg",
          "calories": 250.0,
          "protein": 8.5
        },
        "log": {
          "id": 1,
          "portion": "habis",
          "portion_percentage": 100,
          "portion_label": "Habis",
          "photo_url": "https://example.com/photo.jpg",
          "notes": "Anak makan dengan lahap",
          "logged_at": "2026-01-17T08:00:00+00:00"
        },
        "created_at": "2026-01-15T10:00:00+00:00"
      }
    ]
  }
  ```

#### POST /children/{child}/pmt-schedules
Membuat jadwal PMT untuk anak.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `menu_id` (integer, required): ID menu PMT yang ada.
  - `scheduled_date` (date, required): Tanggal jadwal.
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Jadwal PMT berhasil dibuat",
    "schedule": { ... }
  }
  ```

#### GET /children/{child}/pmt-progress
Statistik kepatuhan dan progres konsumsi PMT.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `start_date` (date, optional): Default awal bulan ini.
  - `end_date` (date, optional): Default akhir bulan ini. Harus >= start_date.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-01-31"
    },
    "summary": {
      "total_scheduled": 20,
      "total_logged": 15,
      "pending": 5,
      "compliance_rate": 75.0,
      "consumption_rate": 85.0
    },
    "consumption_breakdown": {
      "habis": 10,
      "half": 3,
      "quarter": 1,
      "none": 1
    }
  }
  ```

**Penjelasan Metrik:**
- `compliance_rate`: Persentase jadwal yang sudah dicatat vs total jadwal
- `consumption_rate`: Tingkat konsumsi tertimbang (habis=100%, half=50%, quarter=25%, none=0%)

#### POST /pmt-schedules/{schedule}/log
Mencatat realisasi konsumsi PMT dari jadwal yang ada.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `portion` (string, required): `habis`, `half`, `quarter`, `none`.
  - `photo_url` (url, optional): Foto bukti konsumsi. Max 500 karakter.
  - `notes` (string, optional): Max 1000 karakter.
- **Respon Berhasil (201 Created):**
  ```json
  {
    "message": "Konsumsi PMT berhasil dicatat",
    "schedule": { ... }
  }
  ```
- **Respon Gagal (422 Unprocessable Entity):**
  ```json
  {
    "message": "PMT sudah tercatat untuk jadwal ini"
  }
  ```

#### PUT /pmt-schedules/{schedule}/log
Memperbarui catatan realisasi PMT.

- **Autentikasi Diperlukan:** Ya
- **Parameter Body:**
  - `portion` (string, optional): `habis`, `half`, `quarter`, `none`.
  - `photo_url` (url, optional): Max 500 karakter.
  - `notes` (string, optional): Max 1000 karakter.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Log PMT berhasil diperbarui",
    "schedule": { ... }
  }
  ```

**Portion Values:**
| Value | Label | Persentase |
|-------|-------|------------|
| `habis` | Habis | 100% |
| `half` | Setengah | 50% |
| `quarter` | Seperempat | 25% |
| `none` | Tidak dimakan | 0% |

---

### Notifikasi (`/notifications`)

#### GET /notifications
Daftar notifikasi untuk pengguna.

- **Autentikasi Diperlukan:** Ya
- **Parameter Query:**
  - `unread_only` (boolean, optional): Jika true, hanya notifikasi belum dibaca.
  - `type` (string, optional): Filter berdasarkan tipe notifikasi.
  - `per_page` (integer, optional): Default 20.
- **Respon Berhasil (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "type": "pmt_reminder",
        "title": "Pengingat PMT",
        "body": "Waktunya memberikan PMT untuk Si Buah Hati",
        "data": {
          "child_id": 1,
          "schedule_id": 5
        },
        "is_read": false,
        "read_at": null,
        "created_at": "2026-01-17T08:00:00+00:00"
      }
    ],
    "links": { ... },
    "meta": { ... }
  }
  ```

#### GET /notifications/unread-count
Jumlah notifikasi yang belum dibaca.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "unread_count": 5
  }
  ```

#### PUT /notifications/{notification}/read
Menandai satu notifikasi sebagai sudah dibaca.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Notifikasi ditandai sudah dibaca",
    "notification": { ... }
  }
  ```

#### POST /notifications/read-all
Menandai semua notifikasi sebagai sudah dibaca.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Semua notifikasi ditandai sudah dibaca"
  }
  ```

#### DELETE /notifications/{notification}
Menghapus satu notifikasi.

- **Autentikasi Diperlukan:** Ya
- **Respon Berhasil (200 OK):**
  ```json
  {
    "message": "Notifikasi berhasil dihapus"
  }
  ```

---

## Kode Status HTTP Umum

| Kode | Nama | Deskripsi |
|------|------|-----------|
| 200 | OK | Permintaan berhasil. |
| 201 | Created | Sumber daya baru berhasil dibuat. |
| 401 | Unauthorized | Token autentikasi hilang atau tidak valid. |
| 403 | Forbidden | Pengguna tidak memiliki izin untuk mengakses sumber daya ini. |
| 404 | Not Found | Sumber daya yang diminta tidak ditemukan. |
| 422 | Unprocessable Entity | Kesalahan validasi pada parameter yang dikirim. |
| 500 | Internal Server Error | Terjadi kesalahan pada server. |

## Contoh Header Permintaan

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer 12|mYpErSoNaLtOkEnHeRe...
```

## Middleware

Semua endpoint yang memerlukan autentikasi menggunakan middleware:
- `auth:sanctum` - Validasi token Sanctum
- `ensure.parent` - Memastikan pengguna adalah Parent (bukan Nakes)

## Changelog

### 2026-01-27
- Updated documentation to match actual implementation
- Added missing fields: `icon` for foods, `is_active` for children, `bmi` for anthropometry
- Corrected `gender` values to include `other` option
- Added complete response structures for all endpoints
- Added `daily_average` for nutrition summary
- Added PMT progress statistics with consumption breakdown
- Added ASQ-3 status labels and overall status labels
- Added notification `data` object field
