# Dorker: Google Dork Aracı

Dorker, siber güvenlik analizleri ve açık kaynak istihbaratı (OSINT) süreçlerini hızlandırmak için geliştirilmiş, masaüstü tabanlı bir **Google Dork** otomasyon aracıdır. Kullanıcıdan alınan hedef verilerini (domain veya anahtar kelime), bünyesindeki optimize edilmiş dork şablonlarına entegre ederek hızlı sonuçlar üretir.

##  Özellikler

* **Dinamik Dork Üretimi:** Hedef domain veya kelimeyi saniyeler içinde yüzlerce dork şablonuna uygular.
* **Veritabanı Yönetimi (Manager):** Uygulama üzerinden `dorks.json` veritabanına yeni dorklar ekleyebilir veya mevcutları silebilirsiniz.
* **Akıllı Doğrulama:** Hatalı dork girişlerini (site: operatörü eksikliği vb.) ön yüzde denetler.
* **Tek Tıkla Aksiyon:** Üretilen dorkları panoya kopyalayabilir veya doğrudan Google/DuckDuckGo üzerinde aratabilirsiniz.
* **Modern Arayüz:** Karanlık mod (Hacker Theme) destekli, sekmeli ve kullanıcı dostu tasarım.

##  Kullanılan Teknolojiler

* **Backend:** [Go (Golang)](https://go.dev/)
* **Frontend:** HTML, CSS, JavaScript
* **Framework:** [Wails](https://wails.io/) (Go & Web Technologies Desktop App Framework)
* **Database:** JSON (3-Level Nested Structure)

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için sisteminizde Go ve Wails'in kurulu olması gerekmektedir.

1.  **Projeyi Klonlayın:**
    ```bash
    git clone [https://github.com/ucarabdullah/dorker.git](https://github.com/ucarabdullah/dorker.git)
    cd dorker
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    go mod tidy
    ```

3.  **Uygulamayı Geliştirme Modunda Çalıştırın:**
    ```bash
    wails dev
    ```

##  Dosya Yapısı

* `app.go`: Ana backend mantığı ve JSON işleme fonksiyonları.
* `frontend/`: Arayüz dosyaları (HTML, CSS, JS).
* `dorks.json`: Dork şablonlarının tutulduğu hiyerarşik veritabanı.

##  Lisans

Bu proje eğitim amaçlı geliştirilmiştir. Kullanımından doğacak sorumluluk kullanıcıya aittir.
