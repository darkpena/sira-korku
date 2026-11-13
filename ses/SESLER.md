# SIRA — Seslendirme listesi

Her satır `ses/<dosya>.mp3` olarak kaydedilir ve dosya adı `manifest.json` listesine eklenir.
Listede olmayan satırları oyun tarayıcının Türkçe sesiyle okur.

Model: **eleven_v4** (köşeli parantezli duygu etiketleri bu modelde çalışır). Her satırdan 1 versiyon yeterli.
Tahmini toplam: ses satırları ~1.900 kredi, efektler ~150 kredi.

## Sesler (ElevenLabs voice_id)

| Karakter | Ses | voice_id |
|---|---|---|
| Annem | Sibel Malkoc | qLdPxFtPuffoxx5gieBJ |
| Emre | Emre – Deep & Natural | euBhqSy9BY3XHNLwxF7J |
| Nermin Teyze | Sevimino | fM0UmX0B08tG6kSsMe7F |
| Babaanne | Gokce (+ [elderly voice]) | kütüphaneden "Gokce" |
| e-Sıra sistemi / anons | İlknur Önal | xFsOR54lR471QiCvQ5re |
| Gişe memuru | Nihat | MuOq11XzQTthwLhmGZ2V |

## Satırlar

| Dosya | Karakter | Metin | Durum |
|---|---|---|---|
| teyze_d1 | Teyze | [excited] Canlarım, bu testi herkes yapsın! Doğum tarihini giriyorsun, ne kadar ömrün kaldığını söylüyor, ÇOK doğru çıkıyor. [laughs] Benimki on iki yıl çıktı, ay çok sevindim! Hadi bakın, bakın. | **var** |
| emre_d1 | Emre | [laughs] Anne, bende bir gün yazıyor, bir gün! [laughs harder] Yarın cenazeme gelirsiniz artık. Helvayı bol yapın. | **var** |
| emre_vm | Emre | [whispers] [nervous] Deniz... Deniz aç telefonu. [short pause] Kapıda biri var. Annemin sesiyle konuşuyor ama... annem içeride uyuyor. [trembling voice] Linke bir daha girdim. Sıra bendeymiş. Görevler veriyor, Deniz... [gasps] Yine çalıyor. [whispers] Sakın sen girme. Sakın— | **var** |
| anne_d2 | Annem | [crying] Deniz... Emre'yi kaybettik yavrum. [sad] Teyzen perişan. Öğlen cenaze var. Hazırlan, seni de alalım. | **var** |
| babaanne_d2 | Babaanne | [elderly voice] [softly] Deniz, yavrum... O linke bir daha girme. [pause] Bizim köyde de olurdu böyle şeyler. Sıra gelir, sıra geçer. [whispers] Gece kapı çalarsa, adını söyleyen sesi tanısan bile... açma. | **var** |
| call_1 | Annem (taklit) | [warmly] Deniz... yavrum, uyandın mı? | **var** |
| call_2 | Annem (taklit) | Kapıdayım. Anahtarımı unutmuşum. [softly] Aç kapıyı yavrum... dışarısı çok soğuk. | **var** |
| call_3a | Annem (taklit) | [long pause] [deep voice] [slowly] Evdeyim yavrum. Kapının önündeyim. | **var** |
| call_3b | Annem (taklit) | [slowly] Acele et. [deep voice] Acele et, Deniz. | **var** |
| call_4 | Annem (taklit) | [deep voice] [whispers] Sıran geldi, Deniz. | **var** |
| sys_intro | Sistem | Sıra sizde. Kalan süreniz yirmi dört saattir. Sürenizi uzatmak için görevleri tamamlayın. | **var** |
| sys_t1 | Sistem | Görev bir. Bulunduğunuz odanın ışığını kapatın. | **var** |
| sys_t2 | Sistem | Görev iki. Gözlerinizi kapatın. On saniye boyunca açmayın. | **var** |
| sys_t3 | Sistem | Görev üç. Yüzünüzü gösterin. | **var** |
| sys_ok | Sistem | Görev tamamlandı. Süreniz uzatıldı. | **var** |
| sys_fail | Sistem | Görev başarısız. Süreniz kısaltıldı. | **var** |
| emre_whisper | Emre | [whispers] Deniz... açma. Gözlerini açma. [long pause] Ben arkandayım. | **var** |
| anons | Sistem | Kırk yedi numara. Lütfen, sıfır numaralı gişeye. | **var** |
| memur_1 | Memur | [deep voice] [slowly] Kırk yedi numara. Evraklarınız eksik. | **var** |
| memur_kabul | Memur | [deep voice] [slowly] İşleminiz tamamlanmıştır. | **var** |
| memur_bilinmeyen | Memur | [deep voice] [slowly] Bu kişinin sırası... zaten gelmiştir. | **var** |
| babaanne_kursun | Babaanne | [elderly voice] [softly] Kurşun döküyorum yavrum... Sesimi duyarsan, sesime gel. | **var** |
| emre_3d | Emre | [whispers] Deniz... sen de mi baktın? | **var** |
| anne_3d | Annem | [crying] [shouting] Deniz! Deniz uyan yavrum... [crying] ne olur uyan! | **var** |

## Efektler (eleven_text_to_sound_v2, dosya adı `sfx_<ad>.mp3`)

| Dosya | Açıklama |
|---|---|
| sfx_knock | Three slow heavy knocks on a wooden apartment door at night, close and dry, silent hallway |
| sfx_whispers | Many indistinct ghostly voices whispering at once, very close to the ear, creepy horror whispers, no music |
| sfx_sizzle | Molten lead poured into a metal bowl of cold water, sharp violent sizzle and hiss, then bubbling and crackling |
| sfx_hum | Fluorescent tube lights humming and buzzing in a large empty government waiting hall, steady room tone, no voices |
| sfx_stinger | Sudden horror jumpscare stinger, harsh dissonant orchestral hit with a distorted shriek and deep impact |
| sfx_chime | Queue number display chime, two-tone electronic ding dong echoing in a large tiled waiting hall |
| sfx_stamp | Heavy rubber stamp slammed once onto paper on a wooden office counter, single loud hit |
| sfx_drone | Dark ominous low drone ambience, slowly evolving deep rumble, horror film tension bed, no melody |
| sfx_steps | Slow barefoot footsteps on a tiled floor approaching from behind in an empty echoing room |

| sfx_ev | (normal atmosfer) Calm apartment living room at night, refrigerator hum, faint TV murmur from the neighbor through the wall, distant city traffic, cozy quiet home ambience |
| sfx_sabah | (normal atmosfer) Morning apartment ambience, birds chirping outside the window, distant traffic, a kettle softly boiling |

Hepsi üretildi ve `ses/` klasöründe. Bir efekt dosyası silinirse oyun aynı sesi kodla üretir.
Oyunda çalma sırası: 1. gün akşamı `sfx_ev` → gece `sfx_drone` → 2. gün sabahı `sfx_sabah` → e-Sıra bildirimiyle `sfx_drone` → Bekleme Salonu'nda `sfx_hum`.


## Görseller ve video (Image & Video)
- img/*.jpg: Seedream 5.5, 5 gerçekçi kurgusal portre (anne, baba, babaanne, emre, teyze), 320px'e küçültüldü.
- video/emre_kapi.mp4: Gemini Omni Flash 1.2, 10 sn, gece kapı altı ışık; 540px, crf 27 + gren. Orijinal: video/emre_kapi_orijinal.mp4 (yayına konmaz).
