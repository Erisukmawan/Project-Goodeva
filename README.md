# Todo App (NestJS + React)
Aplikasi Todo sederhana dengan Backend NestJS dan Frontend React (Vite). Mendukung fitur add, edit, search, toggle status, dan delete, serta sudah ter-Dockerize.

### 🚀 Cara Menjalankan Aplikasi
#### 1. Backend
```
npm install
```
```
npm run start:dev
```

#### 2. Frontend
```
npm install
```
```
npm run dev
```

#### 3. Docker 
```
docker compose up --build
```

### 🧰 Versi Teknologi
1. Node.js : v20.17.0
2. Backend : Nest.js
3. Frontend : React.js + Vite
4. Container : Docker Compose / Docker

### ⚙️ Keputusan Teknis (Singkat)
1. In-memory storage digunakan agar aplikasi ringan dan mudah dijalankan tanpa konfigurasi database.
2. SweetAlert2 digunakan di frontend untuk meningkatkan UX pada aksi create, update, delete, dan konfirmasi.
3. Docker containerization digunakan agar environment pengembangan dan deployment konsisten di berbagai mesin tanpa konfigurasi manual.

### Screenshot
#### Pengujian di Postman
1. X-user-id ada <br>
<img src="./Images/x-user-id_ada.png" width="400" alt="x-user-id_ada"></a>
2. x-user-id tidak ada <br>
<img src="./Images/missing-user-id.png" width="400" alt="x-user-id-missing"></a>
3. add success <br>
<img src="./Images/add_success.png" width="400" alt="add-success"></a>
4. search success <br>
<img src="./Images/search-success.png" width="400" alt="search-success"></a>
5. toggle update True <br>
<img src="./Images/status_toggle_true_success.png" width="400" alt="toggle-update true"></a>
6. update <br>
<img src="./Images/update_success.png" width="400" alt="update"></a>
7. delete <br>
<img src="./Images/deleted_success.png" width="400" alt="delete"></a>


#### Pengujian di Interface (UI)
1. UI Add Success <br>
<img src="./Images/ui_add_success.png" width="400" alt="ui-add-success"></a>
2. UI Add Failed <br>
<img src="./Images/ui_add_failed.png" width="400" alt="ui-add-failed"></a>
3. UI Search Success <br>
<img src="./Images/ui_search_success.png" width="400" alt="ui-search-success"></a>
4. UI Toggle Update Success <br>
<img src="./Images/ui_toggle_update_success.png" width="400" alt="ui-toggle update-success"></a>
5. UI Update Data Success <br>
<img src="./Images/ui_update_data_success.png" width="400" alt="ui-update-data"></a>
6. UI Delete Success <br>
<img src="./Images/ui_delete_data.png" width="400" alt="ui-delete-data"></a>


#### Docker Desktop
<img src="./Images/running_on_docker.png" width="400" alt="docker-running"></a>
