// --- SEKME (TAB) YÖNETİMİ ---
function sekmeDegistir(sekmeAdi) {
    const genView = document.getElementById('generatorView');
    const manView = document.getElementById('managerView');
    const btnGen = document.getElementById('btn-generator');
    const btnMan = document.getElementById('btn-manager');

    if (sekmeAdi === 'generator') {
        genView.style.display = 'block';
        manView.style.display = 'none';
        
        btnGen.style.color = '#58a6ff';
        btnGen.style.borderBottom = '3px solid #58a6ff';
        btnMan.style.color = '#8b949e';
        btnMan.style.borderBottom = '3px solid transparent';
    } else {
        genView.style.display = 'none';
        manView.style.display = 'block';
        
        btnMan.style.color = '#58a6ff';
        btnMan.style.borderBottom = '3px solid #58a6ff';
        btnGen.style.color = '#8b949e';
        btnGen.style.borderBottom = '3px solid transparent';
        
        // Yönetici paneli açıldığında verileri otomatik çek
        updateCategoryDropdown();
        tumDorklariYukle();
    }
}

// --- GENERATOR (ÜRETİCİ) KISMI ---
function uret() {
    const hedefGirdisi = document.getElementById("targetInput").value;
    const secilenKategori = document.getElementById("categorySelect").value;
    const sonucAlani = document.getElementById("resultsArea");

    if (hedefGirdisi.trim() === "") {
        sonucAlani.innerHTML = "<p style='color: #f85149;'>Please enter a target!</p>";
        return;
    }

    sonucAlani.innerHTML = "<p style='color: #8b949e;'>Generating...</p>";

    // Go tarafındaki Dorker fonksiyonunu çağırıyoruz
    window.go.main.App.Dorker(hedefGirdisi, secilenKategori).then(sonuclar => {
        sonucAlani.innerHTML = "";
        
        if (!sonuclar || sonuclar.length === 0) {
            sonucAlani.innerHTML = "<p style='color: #f85149;'>No dorks found.</p>";
            return;
        }

        // Gelen verileri Başlıklara (Sub Category) göre grupluyoruz
        const grupluDorklar = {};
        sonuclar.forEach(item => {
            if (!grupluDorklar[item.title]) grupluDorklar[item.title] = [];
            grupluDorklar[item.title].push(item.result);
        });

        // Gruplanmış verileri ekrana HTML olarak basıyoruz
        for (const [baslik, dorkListesi] of Object.entries(grupluDorklar)) {
            const accordion = document.createElement("details");
            accordion.className = "category-group";
            accordion.open = true; 

            const summary = document.createElement("summary");
            summary.textContent = `${baslik} (${dorkListesi.length})`; 
            accordion.appendChild(summary);

            dorkListesi.forEach(dorkSorgusu => {
                const satir = document.createElement("div");
                satir.className = "dork-item";
                
                const metin = document.createElement("div");
                metin.className = "dork-text";
                metin.textContent = dorkSorgusu;

                const butonKutusu = document.createElement("div");
                butonKutusu.style.display = "flex";
                butonKutusu.style.gap = "8px";

                // Kopyala Butonu
                const copyButonu = document.createElement("button");
                copyButonu.className = "search-btn";
                copyButonu.style.backgroundColor = "#238636";
                copyButonu.textContent = "Copy";
                copyButonu.onclick = () => {
                    navigator.clipboard.writeText(dorkSorgusu).then(() => {
                        copyButonu.textContent = "Copied!";
                        setTimeout(() => { copyButonu.textContent = "Copy"; }, 1500);
                    });
                };

                // Google Butonu
                const googleButonu = document.createElement("button");
                googleButonu.className = "search-btn";
                googleButonu.style.backgroundColor = "#1f6feb"; 
                googleButonu.textContent = "Google";
                googleButonu.onclick = () => { 
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(dorkSorgusu)}`, '_blank'); 
                };

                // DuckDuckGo Butonu
                const duckButonu = document.createElement("button");
                duckButonu.className = "search-btn";
                duckButonu.style.backgroundColor = "#e06a3b"; 
                duckButonu.textContent = "DuckDuckGo";
                duckButonu.onclick = () => { 
                    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(dorkSorgusu)}`, '_blank'); 
                };

                butonKutusu.appendChild(copyButonu);
                butonKutusu.appendChild(googleButonu);
                butonKutusu.appendChild(duckButonu);

                satir.appendChild(metin);
                satir.appendChild(butonKutusu);
                accordion.appendChild(satir);
            });
            sonucAlani.appendChild(accordion);
        }
    }).catch(err => {
        console.error(err);
        sonucAlani.innerHTML = "<p style='color: #f85149;'>System Error.</p>";
    });
}

function temizle() {
    document.getElementById("targetInput").value = "";
    document.getElementById("resultsArea").innerHTML = "";
    document.getElementById("targetInput").focus();
}

// --- MANAGER (YÖNETİCİ) KISMI ---

// Go tarafındaki AllCategories fonksiyonunu çağırır
function updateCategoryDropdown() {
    const option = document.getElementById("newOption").value;
    const catSelect = document.getElementById("newCategorySelect");

    window.go.main.App.AllCategories(option).then(list => {
        catSelect.innerHTML = ""; 
        if (list) {
            list.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat;
                opt.textContent = cat;
                catSelect.appendChild(opt);
            });
        }
    });
}

// Go tarafındaki AddDork fonksiyonunu çağırır (Validation dahil)
function kaydet() {
    const option = document.getElementById("newOption").value.trim();
    const category = document.getElementById("newCategorySelect").value.trim();
    const dork = document.getElementById("newDork").value.trim();

    if (option === "" || category === "" || dork === "") return alert("Please fill in all fields!");
    if (!dork.includes("{{target}}")) return alert("Error: MUST contain '{{target}}' tag!");
    if (option === "Domain" && !dork.includes("site:")) return alert("Error: Domain dorks MUST include 'site:'!");
    
    if (option === "Anahtar Kelime") {
        if (dork.includes("site:")) return alert("Error: Keyword dorks cannot contain 'site:'.");
        if (!dork.includes("intext:") && !dork.includes("intitle:") && !dork.includes("inurl:")) {
            return alert("Error: MUST include 'intext:', 'intitle:', or 'inurl:'!");
        }
    }

    window.go.main.App.AddDork(option, category, dork).then(mesaj => {
        alert(mesaj);
        if (mesaj.includes("successfully")) {
            document.getElementById("newDork").value = "";
            tumDorklariYukle(); // Eklendikten sonra listeyi yenile
        }
    });
}

// Go tarafındaki AllDorks fonksiyonunu çağırır ve silme butonlarını oluşturur
function tumDorklariYukle() {
    const alan = document.getElementById("allDorksArea");
    alan.innerHTML = "<p style='color: #8b949e;'>Loading database...</p>";

    window.go.main.App.AllDorks().then(data => {
        alan.innerHTML = "";
        
        for (const [anaKat, altKategoriler] of Object.entries(data)) {
            const anaGrup = document.createElement("div");
            anaGrup.innerHTML = `<h3 style="color:#58a6ff; margin-top:20px;">[ ${anaKat} ]</h3>`;
            
            for (const [altKat, dorklar] of Object.entries(altKategoriler)) {
                const details = document.createElement("details");
                details.className = "category-group";
                // Yöneticide kalabalık olmasın diye kapalı (false) gelsin
                details.open = false; 
                details.innerHTML = `<summary>${altKat} (${dorklar.length})</summary>`;
                
                dorklar.forEach(dork => {
                    const satir = document.createElement("div");
                    satir.className = "dork-item";
                    satir.innerHTML = `<div class="dork-text">${dork}</div>`;
                    
                    const silBtn = document.createElement("button");
                    silBtn.className = "search-btn";
                    silBtn.style.backgroundColor = "#da3633"; // Kırmızı
                    silBtn.textContent = "Delete";
                    silBtn.onclick = () => {
                        if(confirm("Are you sure you want to delete this dork?")) {
                            // Go tarafındaki DeleteDork fonksiyonunu çağırır
                            window.go.main.App.DeleteDork(anaKat, altKat, dork).then(mesaj => {
                                tumDorklariYukle(); // Sildikten sonra listeyi yenile
                            });
                        }
                    };
                    
                    satir.appendChild(silBtn);
                    details.appendChild(satir);
                });
                anaGrup.appendChild(details);
            }
            alan.appendChild(anaGrup);
        }
    });
}