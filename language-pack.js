/*!

  Radancy Component Library: Language Pack for i18n

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: None
  Description: This file provides translations for components from the Radancy Component Library (RCL) used across our career sites. 
  Warning: Removing or modifying it could have a significant impact on the accessibility and usability of our global sites, potentially affecting 
  users in multiple languages and regions.

*/

var componentLibraryLanguagePackLoaded = true;
var currentPageLanguage = document.documentElement.getAttribute("lang");

if(currentPageLanguage === "ar") {

    // Animation Toggle

     var atAudioDescriptionLabel = "وصف الصوت";
     var atVideoLabel = "خلفيات متحركة";
     var atPauseButtonLabel = "وقفة الرسوم المتحركة";

    // Accordion 

    var accordionCloseButtonLabel = "يغلق";

    // Dialog

    var labelDialogClose = "يغلق";
    var labelDialogAudioDescription = "وصف صوتي";
    var labelDialogTranscriptHeading = "نص";
    var labelDialogTranscriptButton = "نص الفيديو";
    var labelDialogVideo = "فيديو";
    var labelDialogVideoSuffix = "(فيديو)";
    var labelDialogTranscriptNotFound = "لم يتم العثور على نص النسخة.";
    var labelDialogTranscriptFailed = "فشل تحميل النص.";
    var labelDialogContentNotFound = "لم يتم العثور على المحتوى.";
    var labelDialogLoadingContent = "جارٍ تحميل المحتوى...";
    var labelDialogContentFailed = "فشل تحميل المحتوى.";
    var labelDialogMissingNameHeading = "الاسم المتاح مفقود";
    var labelDialogMissingNameMessage = "يجب توفير اسم يسهل الوصول إليه. أضف خاصية data-label بقيمة وصفية، أو data-labelledby تشير إلى معرّف موجود مسبقًا في الصفحة، أو data-dynamic-label لجلب معرّف تلقائيًا.";
    var labelDialogVideoFallback = "مشغل الفيديو";
    var labelDialogIframeFallback = "المحتوى المضمن";

} else if (currentPageLanguage === "bg") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Аудио описание";
    var atVideoLabel = "Фонова анимация";
    var atPauseButtonLabel = "Пауза анимация";

    // Accordion 

    var accordionCloseButtonLabel = "затвори";
      
    // Dialog

    var labelDialogClose = "Затвори";
    var labelDialogAudioDescription = "Аудио описание";
    var labelDialogTranscriptHeading = "Препис";
    var labelDialogTranscriptButton = "Видео препис";
    var labelDialogVideo = "Видео";
    var labelDialogVideoSuffix = "(Видео)";
    var labelDialogTranscriptNotFound = "Преписът не е намерен.";
    var labelDialogTranscriptFailed = "Зареждането на преписа не бе успешно.";
    var labelDialogContentNotFound = "Съдържанието не е намерено.";
    var labelDialogLoadingContent = "Зареждане на съдържание...";
    var labelDialogContentFailed = "Зареждането на съдържанието не бе успешно.";
    var labelDialogMissingNameHeading = "Липсва достъпно име";
    var labelDialogMissingNameMessage = "Трябва да се предостави достъпно име. Добавете data-label с описателна стойност, data-labelled чрез сочене към идентификатор, който вече е наличен на страницата, или data-dynamic-label за автоматично извличане на такъв.";
    var labelDialogVideoFallback = "Видео плейър";
    var labelDialogIframeFallback = "Вградено съдържание";

} else if (currentPageLanguage === "zh-Hans") {

    // Animation Toggle

    var atAudioDescriptionLabel = "音频描述";
    var atVideoLabel = "背景动画";
    var atPauseButtonLabel = "暂停动画";

    // Accordion 

    var accordionCloseButtonLabel = "关闭";
      
    // Dialog

    var labelDialogClose = "关闭";
    var labelDialogAudioDescription = "音频描述";
    var labelDialogTranscriptHeading = "文字稿";
    var labelDialogTranscriptButton = "视频文字稿";
    var labelDialogVideo = "视频";
    var labelDialogVideoSuffix = "（视频）";
    var labelDialogTranscriptNotFound = "未找到文字记录。";
    var labelDialogTranscriptFailed = "成绩单加载失败。";
    var labelDialogContentNotFound = "未找到内容。";
    var labelDialogLoadingContent = "正在加载内容……";
    var labelDialogContentFailed = "内容加载失败。";
    var labelDialogMissingNameHeading = "缺少可访问名称";
    var labelDialogMissingNameMessage = "必须提供一个易于访问的名称。添加带有描述性值的 data-label，使用 data-labelledby 指向页面上已存在的 id，或使用 data-dynamic-label 自动获取 id。";
    var labelDialogVideoFallback = "视频播放器";
    var labelDialogIframeFallback = "嵌入式内容";

} else if (currentPageLanguage === "zh-Hant") {

    // Animation Toggle

    var atAudioDescriptionLabel = "音頻說明";
    var atVideoLabel = "背景動畫";
    var atPauseButtonLabel = "暫停動畫";

    // Accordion 

    var accordionCloseButtonLabel = "關閉";
      
    // Dialog

    var labelDialogClose = "關閉";
    var labelDialogAudioDescription = "音訊描述";
    var labelDialogTranscriptHeading = "文字稿";
    var labelDialogTranscriptButton = "視訊文字稿";
    var labelDialogVideo = "影片";
    var labelDialogVideoSuffix = "(影片)";
    var labelDialogTranscriptNotFound = "未找到文字記錄。";
    var labelDialogTranscriptFailed = "成績單加載失敗。";
    var labelDialogContentNotFound = "未找到內容。";
    var labelDialogLoadingContent = "正在加載內容…";
    var labelDialogContentFailed = "內容載入失敗。";
    var labelDialogMissingNameHeading = "缺少可訪問名稱";
    var labelDialogMissingNameMessage = "必須提供一個易於訪問的名稱。新增帶有描述性值的 data-label，使用 data-labelledby 指向頁面上已存在的 id，或使用 data-dynamic-label 自動取得 id。";
    var labelDialogVideoFallback = "影片播放器";
    var labelDialogIframeFallback = "嵌入式內容";

} else if (currentPageLanguage === "hr") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audio opis";
    var atVideoLabel = "Pozadinska animacija";
    var atPauseButtonLabel = "Pauza animacija";

    // Accordion 

    var accordionCloseButtonLabel = "Zatvoriti";

    // Dialog

    var labelDialogClose = "Zatvoriti";
    var labelDialogAudioDescription = "Zvučni opis";
    var labelDialogTranscriptHeading = "Prijepis";
    var labelDialogTranscriptButton = "Video transkript";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkript nije pronađen.";
    var labelDialogTranscriptFailed = "Učitavanje transkripta nije uspjelo.";
    var labelDialogContentNotFound = "Sadržaj nije pronađen.";
    var labelDialogLoadingContent = "Učitavanje sadržaja...";
    var labelDialogContentFailed = "Učitavanje sadržaja nije uspjelo.";
    var labelDialogMissingNameHeading = "Nedostaje pristupačno ime";
    var labelDialogMissingNameMessage = "Mora se navesti pristupačan naziv. Dodajte data-label s opisnom vrijednošću, data-labelled upućujući na ID koji je već prisutan na stranici ili data-dynamic-label za automatsko dohvaćanje.";
    var labelDialogVideoFallback = "Video player";
    var labelDialogIframeFallback = "Ugrađeni sadržaj";

} else if (currentPageLanguage === "cs") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Popis zvuku";
    var atVideoLabel = "Animace pozadí";
    var atPauseButtonLabel = "Animace pauzy";

    // Accordion 

    var accordionCloseButtonLabel = "Blízko";
  
    // Dialog

    var labelDialogClose = "Blízko";
    var labelDialogAudioDescription = "Zvukový popis";
    var labelDialogTranscriptHeading = "Přepis";
    var labelDialogTranscriptButton = "Přepis videa";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Přepis nebyl nalezen.";
    var labelDialogTranscriptFailed = "Načtení přepisu se nezdařilo.";
    var labelDialogContentNotFound = "Obsah nenalezen.";
    var labelDialogLoadingContent = "Načítání obsahu...";
    var labelDialogContentFailed = "Obsah se nepodařilo načíst.";
    var labelDialogMissingNameHeading = "Chybí přístupný název";
    var labelDialogMissingNameMessage = "Je nutné zadat přístupný název. Přidejte data-label s popisnou hodnotou, data-labeld odkazující na ID, které je již na stránce přítomno, nebo data-dynamic-label pro automatické načtení ID.";
    var labelDialogVideoFallback = "Videopřehrávač";
    var labelDialogIframeFallback = "Vložený obsah";

} else if (currentPageLanguage === "da") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Lydbeskrivelse";
    var atVideoLabel = "Baggrundsanimation";
    var atPauseButtonLabel = "Pause animation";

    // Accordion 

    var accordionCloseButtonLabel = "Tæt";
      
    // Dialog

    var labelDialogClose = "Tæt";
    var labelDialogAudioDescription = "Lydbeskrivelse";
    var labelDialogTranscriptHeading = "Transskription";
    var labelDialogTranscriptButton = "Videotransskription";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transskription ikke fundet.";
    var labelDialogTranscriptFailed = "Transskriptionen kunne ikke indlæses.";
    var labelDialogContentNotFound = "Indhold ikke fundet.";
    var labelDialogLoadingContent = "Indlæser indhold...";
    var labelDialogContentFailed = "Indholdet kunne ikke indlæses.";
    var labelDialogMissingNameHeading = "Tilgængeligt navn mangler";
    var labelDialogMissingNameMessage = "Der skal angives et tilgængeligt navn. Tilføj data-label med en beskrivende værdi, data-labelledby peger på et id, der allerede findes på siden, eller data-dynamic-label for at hente et automatisk.";
    var labelDialogVideoFallback = "Videoafspiller";
    var labelDialogIframeFallback = "Indlejret indhold";

} else if (currentPageLanguage === "nl") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audiobeschrijving";
    var atVideoLabel = "Achtergrondanimatie";
    var atPauseButtonLabel = "Pauzeer animatie";

    // Accordion 

    var accordionCloseButtonLabel = "Dichtbij";
      
    // Dialog

    var labelDialogClose = "Dichtbij";
    var labelDialogAudioDescription = "Audiobeschrijving";
    var labelDialogTranscriptHeading = "Transcript";
    var labelDialogTranscriptButton = "Videotranscript";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transcript niet gevonden.";
    var labelDialogTranscriptFailed = "Het transcript kon niet worden geladen.";
    var labelDialogContentNotFound = "Inhoud niet gevonden.";
    var labelDialogLoadingContent = "Inhoud laden...";
    var labelDialogContentFailed = "De inhoud kon niet worden geladen.";
    var labelDialogMissingNameHeading = "Toegankelijke naam ontbreekt";
    var labelDialogMissingNameMessage = "Er moet een toegankelijke naam worden opgegeven. Voeg `data-label` toe met een beschrijvende waarde, `data-labelledby` die verwijst naar een ID die al op de pagina aanwezig is, of `data-dynamic-label` om er automatisch een op te halen.";
    var labelDialogVideoFallback = "Videospeler";
    var labelDialogIframeFallback = "Ingesloten inhoud";

} else if (currentPageLanguage === "en-GB") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audio Description";
    var atVideoLabel = "Background Animation";
    var atPauseButtonLabel = "Pause Animation";

    // Accordion 

    var accordionCloseButtonLabel = "Close";
      
    // Dialog

    var labelDialogClose = "Close";
    var labelDialogAudioDescription = "Audio Description";
    var labelDialogTranscriptHeading = "Transcript";
    var labelDialogTranscriptButton = "Video Transcript";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transcript not found.";
    var labelDialogTranscriptFailed = "Transcript failed to load.";
    var labelDialogContentNotFound = "Content not found.";
    var labelDialogLoadingContent = "Loading content...";
    var labelDialogContentFailed = "Content failed to load.";
    var labelDialogMissingNameHeading = "Accessible Name Missing";
    var labelDialogMissingNameMessage = "An accessible name must be provided. Add data-label with a descriptive value, data-labelledby pointing to an id already present on the page, or data-dynamic-label to fetch one automatically.";
    var labelDialogVideoFallback = "Video Player";
    var labelDialogIframeFallback = "Embedded Content";

} else if (currentPageLanguage === "et") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Helikirjeldus";
    var atVideoLabel = "Taustaanimatsioon";
    var atPauseButtonLabel = "Pausi animatsioon";

    // Accordion 

    var accordionCloseButtonLabel = "Sule";
      
    // Dialog

    var labelDialogClose = "Sule";
    var labelDialogAudioDescription = "Heli kirjeldus";
    var labelDialogTranscriptHeading = "Transkript";
    var labelDialogTranscriptButton = "Video transkriptsioon";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkripti ei leitud.";
    var labelDialogTranscriptFailed = "Transkripti laadimine ebaõnnestus.";
    var labelDialogContentNotFound = "Sisu ei leitud.";
    var labelDialogLoadingContent = "Sisu laadimine...";
    var labelDialogContentFailed = "Sisu laadimine ebaõnnestus.";
    var labelDialogMissingNameHeading = "Ligipääsetav nimi puudub";
    var labelDialogMissingNameMessage = "Sisestage ligipääsetav nimi. Lisage kirjeldava väärtusega „data-label”, lehel juba olevale ID-le osutades „data-label” või automaatselt ID-ks „data-dynamic-label”.";
    var labelDialogVideoFallback = "Videopleier";
    var labelDialogIframeFallback = "Manustatud sisu";

} else if (currentPageLanguage === "fi") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Äänikuvaus";
    var atVideoLabel = "Taustaanimaatio";
    var atPauseButtonLabel = "Tauko -animaatio";

    // Accordion 

    var accordionCloseButtonLabel = "Lähellä";

    // Dialog

    var labelDialogClose = "Lähellä";
    var labelDialogAudioDescription = "Äänikuvaus";
    var labelDialogTranscriptHeading = "transkriptio";
    var labelDialogTranscriptButton = "Videon transkriptio";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkriptiota ei löytynyt.";
    var labelDialogTranscriptFailed = "Transkription lataaminen epäonnistui.";
    var labelDialogContentNotFound = "Sisältöä ei löytynyt.";
    var labelDialogLoadingContent = "Sisältöä ladataan...";
    var labelDialogContentFailed = "Sisällön lataaminen epäonnistui.";
    var labelDialogMissingNameHeading = "Esteettömän nimen puuttuminen";
    var labelDialogMissingNameMessage = "Esteetön nimi on annettava. Lisää data-label kuvaavalla arvolla, data-label osoittamalla sivulla jo olevaan tunnukseen tai data-dynamic-label noutaaksesi sellaisen automaattisesti.";
    var labelDialogVideoFallback = "Videosoitin";
    var labelDialogIframeFallback = "Upotettu sisältö";

} else if (currentPageLanguage === "fr") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Description audio";
    var atVideoLabel = "Animation de fond";
    var atPauseButtonLabel = "Animation de pause";    
    
    // Accordion 

    var accordionCloseButtonLabel = "Fermer";

    // Dialog

    var labelDialogClose = "Fermer";
    var labelDialogAudioDescription = "Description audio";
    var labelDialogTranscriptHeading = "Transcription";
    var labelDialogTranscriptButton = "Transcription vidéo";
    var labelDialogVideo = "Vidéo";
    var labelDialogVideoSuffix = "(Vidéo)";
    var labelDialogTranscriptNotFound = "Transcription introuvable.";
    var labelDialogTranscriptFailed = "Impossible de charger la transcription.";
    var labelDialogContentNotFound = "Contenu introuvable.";
    var labelDialogLoadingContent = "Chargement du contenu...";
    var labelDialogContentFailed = "Le contenu n'a pas pu être chargé.";
    var labelDialogMissingNameHeading = "Nom accessible manquant";
    var labelDialogMissingNameMessage = "Un nom accessible doit être fourni. Ajoutez `data-label` avec une valeur descriptive, `data-labelledby` en faisant référence à un identifiant déjà présent sur la page, ou `data-dynamic-label` pour en récupérer un automatiquement.";
    var labelDialogVideoFallback = "Lecteur vidéo";
    var labelDialogIframeFallback = "Contenu intégré";

} else if (currentPageLanguage === "de") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audiobeschreibung";
    var atVideoLabel = "Hintergrundanimation";
    var atPauseButtonLabel = "Pause Animation";

    // Accordion 

    var accordionCloseButtonLabel = "Schließen";
  
    // Dialog

    var labelDialogClose = "Schließen";
    var labelDialogAudioDescription = "Audiobeschreibung";
    var labelDialogTranscriptHeading = "Transkript";
    var labelDialogTranscriptButton = "Videotranskript";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkript nicht gefunden.";
    var labelDialogTranscriptFailed = "Das Transkript konnte nicht geladen werden.";
    var labelDialogContentNotFound = "Inhalt nicht gefunden.";
    var labelDialogLoadingContent = "Inhalt wird geladen...";
    var labelDialogContentFailed = "Inhalt konnte nicht geladen werden.";
    var labelDialogMissingNameHeading = "Zugänglicher Name fehlt";
    var labelDialogMissingNameMessage = "Es muss ein aussagekräftiger Name angegeben werden. Fügen Sie ein data-label mit einem beschreibenden Wert hinzu, ein data-labelledby, das auf eine bereits auf der Seite vorhandene ID verweist, oder ein data-dynamic-label, um automatisch eine ID abzurufen.";
    var labelDialogVideoFallback = "Videoplayer";
    var labelDialogIframeFallback = "Eingebetteter Inhalt";

} else if (currentPageLanguage === "he") {

    // Animation Toggle

    var atAudioDescriptionLabel = "תיאור שמע";
    var atVideoLabel = "אנימציה רקע";
    var atPauseButtonLabel = "להשהות אנימציה";

    // Accordion 

    var accordionCloseButtonLabel = "לִסְגוֹר";

    // Dialog

    var labelDialogClose = "לִסְגוֹר";
    var labelDialogAudioDescription = "תיאור שמע";
    var labelDialogTranscriptHeading = "תמלול";
    var labelDialogTranscriptButton = "תמלול וידאו";
    var labelDialogVideo = "וִידֵאוֹ";
    var labelDialogVideoSuffix = "(וִידֵאוֹ)";
    var labelDialogTranscriptNotFound = "התמליל לא נמצא.";
    var labelDialogTranscriptFailed = "טעינת התמליל נכשלה.";
    var labelDialogContentNotFound = "התוכן לא נמצא.";
    var labelDialogLoadingContent = "טוען תוכן...";
    var labelDialogContentFailed = "טעינת התוכן נכשלה.";
    var labelDialogMissingNameHeading = "חסר שם נגיש";
    var labelDialogMissingNameMessage = "יש לספק שם נגיש. הוסף data-label עם ערך תיאורי, data-labeled על ידי הצבעה למזהה שכבר קיים בדף, או data-dynamic-label כדי לאחזר שם אוטומטית.";
    var labelDialogVideoFallback = "נַגָן וִידֵיאוֹ";
    var labelDialogIframeFallback = "תוכן מוטמע";

} else if (currentPageLanguage === "hu") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audio leírás";
    var atVideoLabel = "Háttér animáció";
    var atPauseButtonLabel = "Szünet animáció";

    // Accordion 

    var accordionCloseButtonLabel = "Közeli";

    // Dialog

    var labelDialogClose = "Közeli";
    var labelDialogAudioDescription = "Hangos leírás";
    var labelDialogTranscriptHeading = "Átirat";
    var labelDialogTranscriptButton = "Videó átirat";
    var labelDialogVideo = "Videó";
    var labelDialogVideoSuffix = "(Videó)";
    var labelDialogTranscriptNotFound = "Átirat nem található.";
    var labelDialogTranscriptFailed = "Az átirat betöltése sikertelen.";
    var labelDialogContentNotFound = "A tartalom nem található.";
    var labelDialogLoadingContent = "Tartalom betöltése...";
    var labelDialogContentFailed = "A tartalom betöltése sikertelen.";
    var labelDialogMissingNameHeading = "Hiányzó elérhető név";
    var labelDialogMissingNameMessage = "Meg kell adni egy könnyen hozzáférhető nevet. Adjon meg egy leíró értékkel rendelkező „data-label” nevet, egy oldalon már jelen lévő azonosítóra mutató „data-label” nevet, vagy egy automatikus lekéréshez a „data-dynamic-label” nevet.";
    var labelDialogVideoFallback = "Videolejátszó";
    var labelDialogIframeFallback = "Beágyazott tartalom";

} else if (currentPageLanguage === "is") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Hljóðlýsing";
    var atVideoLabel = "Bakgrunns fjör";
    var atPauseButtonLabel = "Hlé á fjörum";

    // Accordion 

    var accordionCloseButtonLabel = "Loka";

    // Dialog

    var labelDialogClose = "Loka";
    var labelDialogAudioDescription = "Hljóðlýsing";
    var labelDialogTranscriptHeading = "Afrit";
    var labelDialogTranscriptButton = "Myndbandsuppskrift";
    var labelDialogVideo = "Myndband";
    var labelDialogVideoSuffix = "(Myndband)";
    var labelDialogTranscriptNotFound = "Afrit fannst ekki.";
    var labelDialogTranscriptFailed = "Mistókst að hlaða uppskriftinni.";
    var labelDialogContentNotFound = "Efni fannst ekki.";
    var labelDialogLoadingContent = "Hleður inn efni...";
    var labelDialogContentFailed = "Mistókst að hlaða efni.";
    var labelDialogMissingNameHeading = "Aðgengilegt nafn vantar";
    var labelDialogMissingNameMessage = "Gefa þarf upp aðgengilegt nafn. Bætið við `data-label` með lýsandi gildi, `data-labelled` með því að vísa á auðkenni sem er þegar til staðar á síðunni, eða `data-dynamic-label` til að sækja eitt sjálfkrafa.";
    var labelDialogVideoFallback = "Myndspilari";
    var labelDialogIframeFallback = "Innbyggt efni";

} else if (currentPageLanguage === "it") {

    // Animation Toggle

    var atAudioDescriptionLabel = " Descrizione audio";
    var atVideoLabel = "Animazione di sfondo";
    var atPauseButtonLabel = "Pausa animazione";

    // Accordion 

    var accordionCloseButtonLabel = "Vicino";
  
    // Dialog

    var labelDialogClose = "Vicino";
    var labelDialogAudioDescription = "Descrizione audio";
    var labelDialogTranscriptHeading = "Trascrizione";
    var labelDialogTranscriptButton = "Trascrizione del video";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Trascrizione non trovata.";
    var labelDialogTranscriptFailed = "Impossibile caricare la trascrizione.";
    var labelDialogContentNotFound = "Contenuto non trovato.";
    var labelDialogLoadingContent = "Caricamento dei contenuti in corso...";
    var labelDialogContentFailed = "Impossibile caricare il contenuto.";
    var labelDialogMissingNameHeading = "Nome accessibile mancante";
    var labelDialogMissingNameMessage = "È necessario fornire un nome accessibile. Aggiungi un'etichetta dati con un valore descrittivo, un'etichetta dati con l'attributo `data-labelledby` che punta a un ID già presente nella pagina, oppure un'etichetta dati con l'attributo `data-dynamic-label` per recuperarne una automaticamente.";
    var labelDialogVideoFallback = "Lettore video";
    var labelDialogIframeFallback = "Contenuto incorporato";

} else if (currentPageLanguage === "ja") {

    // Animation Toggle

    var atAudioDescriptionLabel = "オーディオの説明";
    var atVideoLabel = "背景アニメーション";
    var atPauseButtonLabel = "アニメーションを一時停止します";

    // Accordion 

    var accordionCloseButtonLabel = "近い";

    // Dialog

    var labelDialogClose = "近い";
    var labelDialogAudioDescription = "音声解説";
    var labelDialogTranscriptHeading = "文字起こし";
    var labelDialogTranscriptButton = "動画の文字起こし";
    var labelDialogVideo = "ビデオ";
    var labelDialogVideoSuffix = "（ビデオ）";
    var labelDialogTranscriptNotFound = "文字起こしが見つかりませんでした。";
    var labelDialogTranscriptFailed = "文字起こしデータの読み込みに失敗しました。";
    var labelDialogContentNotFound = "コンテンツが見つかりません。";
    var labelDialogLoadingContent = "コンテンツを読み込んでいます...";
    var labelDialogContentFailed = "コンテンツの読み込みに失敗しました。";
    var labelDialogMissingNameHeading = "アクセシブルネームがありません";
    var labelDialogMissingNameMessage = "アクセス可能な名前を指定する必要があります。説明的な値を指定するdata-label、ページに既に存在するIDを指すdata-labelledby、または自動的に取得するdata-dynamic-labelを追加してください。";
    var labelDialogVideoFallback = "ビデオプレーヤー";
    var labelDialogIframeFallback = "埋め込みコンテンツ";

} else if (currentPageLanguage === "ko") {

    // Animation Toggle

    var atAudioDescriptionLabel = "오디오 설명";
    var atVideoLabel = "배경 애니메이션";
    var atPauseButtonLabel = "애니메이션을 일시 중지합니다";

    // Accordion 

    var accordionCloseButtonLabel = "닫다";

    // Dialog

    var labelDialogClose = "닫다";
    var labelDialogAudioDescription = "오디오 설명";
    var labelDialogTranscriptHeading = "성적 증명서";
    var labelDialogTranscriptButton = "영상 대본";
    var labelDialogVideo = "동영상";
    var labelDialogVideoSuffix = "(동영상)";
    var labelDialogTranscriptNotFound = "녹취록을 찾을 수 없습니다.";
    var labelDialogTranscriptFailed = "녹취록을 불러오는 데 실패했습니다.";
    var labelDialogContentNotFound = "콘텐츠를 찾을 수 없습니다.";
    var labelDialogLoadingContent = "콘텐츠를 불러오는 중...";
    var labelDialogContentFailed = "콘텐츠를 불러오는 데 실패했습니다.";
    var labelDialogMissingNameHeading = "접근 가능한 이름이 누락되었습니다";
    var labelDialogMissingNameMessage = "접근 가능한 이름을 제공해야 합니다. 설명적인 값을 가진 `data-label`을 추가하거나, 페이지에 이미 있는 ID를 가리키는 `data-labelledby`를 추가하거나, 자동으로 ID를 가져오는 `data-dynamic-label`을 추가하세요.";
    var labelDialogVideoFallback = "비디오 플레이어";
    var labelDialogIframeFallback = "내장 콘텐츠";

} else if (currentPageLanguage === "lv") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Audio apraksts";
    var atVideoLabel = "Fona animācija";
    var atPauseButtonLabel = "Pauzes animācija";

    // Accordion 

    var accordionCloseButtonLabel = "Aizvērt";

    // Dialog

    var labelDialogClose = "Aizvērt";
    var labelDialogAudioDescription = "Audio apraksts";
    var labelDialogTranscriptHeading = "Transkripts";
    var labelDialogTranscriptButton = "Video transkripts";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkripts nav atrasts.";
    var labelDialogTranscriptFailed = "Neizdevās ielādēt transkriptu.";
    var labelDialogContentNotFound = "Saturs nav atrasts.";
    var labelDialogLoadingContent = "Notiek satura ielāde...";
    var labelDialogContentFailed = "Neizdevās ielādēt saturu.";
    var labelDialogMissingNameHeading = "Trūkst pieejamā nosaukuma";
    var labelDialogMissingNameMessage = "Jānorāda pieejams nosaukums. Pievienojiet “data-label” ar aprakstošu vērtību, “data-label” ar norādi uz lapā jau esošu ID vai “data-dynamic-label”, lai to automātiski ielādētu.";
    var labelDialogVideoFallback = "Video atskaņotājs";
    var labelDialogIframeFallback = "Iegultais saturs";

} else if (currentPageLanguage === "lt") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Garso aprašymas";
    var atVideoLabel = "Fono animacija";
    var atPauseButtonLabel = "Pauzės animacija";

    // Accordion 

    var accordionCloseButtonLabel = "Uždaryti";
 
    // Dialog

    var labelDialogClose = "Uždaryti";
    var labelDialogAudioDescription = "Garso aprašymas";
    var labelDialogTranscriptHeading = "Nuorašas";
    var labelDialogTranscriptButton = "Vaizdo įrašo transkripcija";
    var labelDialogVideo = "Vaizdo įrašas";
    var labelDialogVideoSuffix = "(Vaizdo įrašas)";
    var labelDialogTranscriptNotFound = "Nuorašas nerastas.";
    var labelDialogTranscriptFailed = "Nepavyko įkelti transkripcijos.";
    var labelDialogContentNotFound = "Turinys nerastas.";
    var labelDialogLoadingContent = "Kraunamas turinys...";
    var labelDialogContentFailed = "Nepavyko įkelti turinio.";
    var labelDialogMissingNameHeading = "Trūksta prieinamo pavadinimo";
    var labelDialogMissingNameMessage = "Turi būti pateiktas lengvai suprantamas pavadinimas. Pridėkite „data-label“ su aprašomąja reikšme, „data-label“ nurodant į puslapyje jau esantį ID arba „data-dynamic-label“, kad jis būtų gautas automatiškai.";
    var labelDialogVideoFallback = "Vaizdo grotuvas";
    var labelDialogIframeFallback = "Įterptasis turinys";

} else if (currentPageLanguage === "ms") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Penerangan audio";
    var atVideoLabel = "Animasi latar belakang";
    var atPauseButtonLabel = "Jeda animasi";

    // Accordion 

    var accordionCloseButtonLabel = "tutup";

    // Dialog

    var labelDialogClose = "Tutup";
    var labelDialogAudioDescription = "Penerangan Audio";
    var labelDialogTranscriptHeading = "Transkrip";
    var labelDialogTranscriptButton = "Transkrip Video";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkrip tidak ditemui.";
    var labelDialogTranscriptFailed = "Transkrip gagal dimuatkan.";
    var labelDialogContentNotFound = "Kandungan tidak ditemui.";
    var labelDialogLoadingContent = "Memuatkan kandungan...";
    var labelDialogContentFailed = "Kandungan gagal dimuatkan.";
    var labelDialogMissingNameHeading = "Nama Boleh Diakses Hilang";
    var labelDialogMissingNameMessage = "Nama yang boleh diakses mesti diberikan. Tambahkan data-label dengan nilai deskriptif, data-labelleddengan menunjuk ke id yang sedia ada pada halaman atau data-dynamic-label untuk mengambilnya secara automatik.";
    var labelDialogVideoFallback = "Pemain Video";
    var labelDialogIframeFallback = "Kandungan Terbenam";

} else if (currentPageLanguage === "no") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Lydbeskrivelse";
    var atVideoLabel = "Bakgrunnsanimasjon";
    var atPauseButtonLabel = "Pause animasjon";

    // Accordion 

    var accordionCloseButtonLabel = "Lukke";

    // Dialog

    var labelDialogClose = "Lukke";
    var labelDialogAudioDescription = "Lydbeskrivelse";
    var labelDialogTranscriptHeading = "Transkripsjon";
    var labelDialogTranscriptButton = "Videotranskripsjon";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkripsjonen ble ikke funnet.";
    var labelDialogTranscriptFailed = "Kunne ikke laste inn transkripsjonen.";
    var labelDialogContentNotFound = "Innholdet ble ikke funnet.";
    var labelDialogLoadingContent = "Laster inn innhold ...";
    var labelDialogContentFailed = "Kunne ikke laste inn innholdet.";
    var labelDialogMissingNameHeading = "Tilgjengelig navn mangler";
    var labelDialogMissingNameMessage = "Et tilgjengelig navn må oppgis. Legg til data-label med en beskrivende verdi, data-labeledby som peker til en ID som allerede finnes på siden, eller data-dynamic-label for å hente en automatisk.";
    var labelDialogVideoFallback = "Videospiller";
    var labelDialogIframeFallback = "Innebygd innhold";

} else if (currentPageLanguage === "pl") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Opis dźwięku";
    var atVideoLabel = "Animacja w tle";
    var atPauseButtonLabel = "Animacja pauzy";

    // Accordion 

    var accordionCloseButtonLabel = "Zamknąć";

    // Dialog

    var labelDialogClose = "Zamknąć";
    var labelDialogAudioDescription = "Audiodeskrypcja";
    var labelDialogTranscriptHeading = "Transkrypcja";
    var labelDialogTranscriptButton = "Transkrypcja wideo";
    var labelDialogVideo = "Wideo";
    var labelDialogVideoSuffix = "(Wideo)";
    var labelDialogTranscriptNotFound = "Nie znaleziono transkryptu.";
    var labelDialogTranscriptFailed = "Nie udało się załadować transkryptu.";
    var labelDialogContentNotFound = "Nie znaleziono treści.";
    var labelDialogLoadingContent = "Ładowanie treści...";
    var labelDialogContentFailed = "Nie udało się załadować treści.";
    var labelDialogMissingNameHeading = "Brak dostępnej nazwy";
    var labelDialogMissingNameMessage = "Należy podać dostępną nazwę. Dodaj etykietę danych z wartością opisową, etykietę danych (data-labeled), wskazującą na identyfikator już obecny na stronie, lub dynamiczną etykietę danych (data-dynamic-label), aby pobrać ją automatycznie.";
    var labelDialogVideoFallback = "Odtwarzacz wideo";
    var labelDialogIframeFallback = "Treść osadzona";

} else if (currentPageLanguage === "pt") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Descrição do áudio";
    var atVideoLabel = "Animação de fundo";
    var atPauseButtonLabel = "Pausa animação";

    // Accordion 

    var accordionCloseButtonLabel = "Fechar";

    // Dialog

    var labelDialogClose = "Fechar";
    var labelDialogAudioDescription = "Descrição em áudio";
    var labelDialogTranscriptHeading = "Transcrição";
    var labelDialogTranscriptButton = "Transcrição do vídeo";
    var labelDialogVideo = "Vídeo";
    var labelDialogVideoSuffix = "(Vídeo)";
    var labelDialogTranscriptNotFound = "Transcrição não encontrada.";
    var labelDialogTranscriptFailed = "A transcrição não pôde ser carregada.";
    var labelDialogContentNotFound = "Conteúdo não encontrado.";
    var labelDialogLoadingContent = "Carregando conteúdo...";
    var labelDialogContentFailed = "O conteúdo não carregou.";
    var labelDialogMissingNameHeading = "Nome acessível ausente";
    var labelDialogMissingNameMessage = "É necessário fornecer um nome acessível. Adicione `data-label` com um valor descritivo, `data-labeledby` apontando para um ID já presente na página ou `data-dynamic-label` para buscar um automaticamente.";
    var labelDialogVideoFallback = "Reprodutor de vídeo";
    var labelDialogIframeFallback = "Conteúdo incorporado";

} else if (currentPageLanguage === "ro") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Descriere audio";
    var atVideoLabel = "Animație de fundal";
    var atPauseButtonLabel = "Pauză animație";

    // Accordion 

    var accordionCloseButtonLabel = "Aproape";

    // Dialog

    var labelDialogClose = "Aproape";
    var labelDialogAudioDescription = "Descriere audio";
    var labelDialogTranscriptHeading = "Transcriere";
    var labelDialogTranscriptButton = "Transcriere video";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transcrierea nu a fost găsită.";
    var labelDialogTranscriptFailed = "Transcrierea nu s-a putut încărca.";
    var labelDialogContentNotFound = "Conținut negăsit.";
    var labelDialogLoadingContent = "Se încarcă conținutul...";
    var labelDialogContentFailed = "Conținutul nu s-a putut încărca.";
    var labelDialogMissingNameHeading = "Nume accesibil lipsește";
    var labelDialogMissingNameMessage = "Trebuie furnizat un nume accesibil. Adăugați data-label cu o valoare descriptivă, data-labeled indicând un ID deja prezent pe pagină sau data-dynamic-label pentru a prelua unul automat.";
    var labelDialogVideoFallback = "Player video";
    var labelDialogIframeFallback = "Conținut încorporat";

} else if (currentPageLanguage === "ru") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Аудио описание";
    var atVideoLabel = "Фоновая анимация";
    var atPauseButtonLabel = "Пауза анимация";

    // Accordion 

    var accordionCloseButtonLabel = "Закрывать";

    // Dialog

    var labelDialogClose = "Закрывать";
    var labelDialogAudioDescription = "Аудиоописание";
    var labelDialogTranscriptHeading = "Стенограмма";
    var labelDialogTranscriptButton = "Текст видео";
    var labelDialogVideo = "Видео";
    var labelDialogVideoSuffix = "(Видео)";
    var labelDialogTranscriptNotFound = "Транскрипт не найден.";
    var labelDialogTranscriptFailed = "Не удалось загрузить расшифровку.";
    var labelDialogContentNotFound = "Содержимое не найдено.";
    var labelDialogLoadingContent = "Загрузка содержимого...";
    var labelDialogContentFailed = "Не удалось загрузить контент.";
    var labelDialogMissingNameHeading = "Отсутствует доступное имя";
    var labelDialogMissingNameMessage = "Необходимо указать доступное имя. Добавьте data-label с описательным значением, data-labeledby, указывающий на уже существующий на странице идентификатор, или data-dynamic-label для автоматического получения идентификатора.";
    var labelDialogVideoFallback = "Видеоплеер";
    var labelDialogIframeFallback = "Встроенный контент";

} else if (currentPageLanguage === "sr") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Аудио опис";
    var atVideoLabel = "Анимација позадине";
    var atPauseButtonLabel = "Паузирајте анимацију";

    // Accordion 

    var accordionCloseButtonLabel = "Затвори";

    // Dialog

    var labelDialogClose = "Затвори";
    var labelDialogAudioDescription = "Аудио опис";
    var labelDialogTranscriptHeading = "Транскрипт";
    var labelDialogTranscriptButton = "Видео транскрипт";
    var labelDialogVideo = "Видео";
    var labelDialogVideoSuffix = "(Видео)";
    var labelDialogTranscriptNotFound = "Транскрипт није пронађен.";
    var labelDialogTranscriptFailed = "Учитавање транскрипта није успело.";
    var labelDialogContentNotFound = "Садржај није пронађен.";
    var labelDialogLoadingContent = "Учитавање садржаја...";
    var labelDialogContentFailed = "Учитавање садржаја није успело.";
    var labelDialogMissingNameHeading = "Недостаје приступачно име";
    var labelDialogMissingNameMessage = "Мора се навести приступачно име. Додајте data-label са описном вредношћу, data-labeled указивањем на идентификатор који је већ присутан на страници или data-dynamic-label да бисте га аутоматски преузели.";
    var labelDialogVideoFallback = "Видео плејер";
    var labelDialogIframeFallback = "Уграђени садржај";

} else if (currentPageLanguage === "sk") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Popis zvuku";
    var atVideoLabel = "Animácia pozadia";
    var atPauseButtonLabel = "Pozastavenie animácie";

    // Accordion 

    var accordionCloseButtonLabel = "Zavrieť";

    // Dialog

    var labelDialogClose = "Zatvoriť";
    var labelDialogAudioDescription = "Zvukový popis";
    var labelDialogTranscriptHeading = "Prepis";
    var labelDialogTranscriptButton = "Prepis videa";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Prepis sa nenašiel.";
    var labelDialogTranscriptFailed = "Prepis sa nepodarilo načítať.";
    var labelDialogContentNotFound = "Obsah sa nenašiel.";
    var labelDialogLoadingContent = "Načítava sa obsah...";
    var labelDialogContentFailed = "Obsah sa nepodarilo načítať.";
    var labelDialogMissingNameHeading = "Chýba názov pre prístupné osoby";
    var labelDialogMissingNameMessage = "Musí byť zadaný prístupný názov. Pridajte data-label s popisnou hodnotou, data-labeld s odkazom na ID, ktoré je už na stránke prítomné, alebo data-dynamic-label pre automatické načítanie.";
    var labelDialogVideoFallback = "Prehrávač videa";
    var labelDialogIframeFallback = "Vložený obsah";

} else if (currentPageLanguage === "sl") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Zvočni opis";
    var atVideoLabel = "Animacija v ozadju";
    var atPauseButtonLabel = "Premor animacije";

    // Accordion 

    var accordionCloseButtonLabel = "Zapri";
 
    // Dialog

    var labelDialogClose = "Zapri";
    var labelDialogAudioDescription = "Zvočni opis";
    var labelDialogTranscriptHeading = "Prepis";
    var labelDialogTranscriptButton = "Video prepis";
    var labelDialogVideo = "Videoposnetek";
    var labelDialogVideoSuffix = "(Videoposnetek)";
    var labelDialogTranscriptNotFound = "Prepisa ni bilo mogoče najti.";
    var labelDialogTranscriptFailed = "Prepis se ni naložil.";
    var labelDialogContentNotFound = "Vsebine ni bilo mogoče najti.";
    var labelDialogLoadingContent = "Nalaganje vsebine ...";
    var labelDialogContentFailed = "Vsebine ni bilo mogoče naložiti.";
    var labelDialogMissingNameHeading = "Manjka dostopno ime";
    var labelDialogMissingNameMessage = "Navesti je treba dostopno ime. Dodajte oznako podatkov z opisno vrednostjo, oznako podatkov s kazalcem na ID, ki je že prisoten na strani, ali oznako podatkov z dinamično oznako, da jo samodejno pridobite.";
    var labelDialogVideoFallback = "Predvajalnik videoposnetkov";
    var labelDialogIframeFallback = "Vdelana vsebina";

} else if (currentPageLanguage === "es") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Descripción de audio";
    var atVideoLabel = "Animación de fondo";
    var atPauseButtonLabel = "Animación de pausa";

    // Accordion 

    var accordionCloseButtonLabel = "Cerca";

    // Dialog

    var labelDialogClose = "Cerca";
    var labelDialogAudioDescription = "Descripción de audio";
    var labelDialogTranscriptHeading = "Transcripción";
    var labelDialogTranscriptButton = "Transcripción del video";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "No se encontró la transcripción.";
    var labelDialogTranscriptFailed = "No se pudo cargar la transcripción.";
    var labelDialogContentNotFound = "Contenido no encontrado.";
    var labelDialogLoadingContent = "Cargando contenido...";
    var labelDialogContentFailed = "El contenido no se pudo cargar.";
    var labelDialogMissingNameHeading = "Falta el nombre accesible";
    var labelDialogMissingNameMessage = "Debe proporcionarse un nombre accesible. Añada `data-label` con un valor descriptivo, `data-labelledby` apuntando a un ID que ya esté presente en la página, o `data-dynamic-label` para obtenerlo automáticamente.";
    var labelDialogVideoFallback = "Reproductor de video";
    var labelDialogIframeFallback = "Contenido incrustado";

} else if (currentPageLanguage === "sv") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Ljudbeskrivning";
    var atVideoLabel = "Bakgrundsanimering";
    var atPauseButtonLabel = "Pausanimation";

    // Accordion 

    var accordionCloseButtonLabel = "Nära";

    // Dialog

    var labelDialogClose = "Nära";
    var labelDialogAudioDescription = "Ljudbeskrivning";
    var labelDialogTranscriptHeading = "Avskrift";
    var labelDialogTranscriptButton = "Videotranskription";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transkriptet hittades inte.";
    var labelDialogTranscriptFailed = "Transkriptionen kunde inte läsas in.";
    var labelDialogContentNotFound = "Innehållet hittades inte.";
    var labelDialogLoadingContent = "Laddar innehåll...";
    var labelDialogContentFailed = "Innehållet kunde inte laddas.";
    var labelDialogMissingNameHeading = "Tillgängligt namn saknas";
    var labelDialogMissingNameMessage = "Ett lättillgängligt namn måste anges. Lägg till data-label med ett beskrivande värde, data-labelledby som pekar på ett id som redan finns på sidan, eller data-dynamic-label för att hämta ett automatiskt.";
    var labelDialogVideoFallback = "Videospelare";
    var labelDialogIframeFallback = "Inbäddat innehåll";

} else if (currentPageLanguage === "th") {

    // Animation Toggle

    var atAudioDescriptionLabel = "คำอธิบายเสียง";
    var atVideoLabel = "ภาพเคลื่อนไหวพื้นหลัง";
    var atPauseButtonLabel = "หยุดเคลื่อนไหวชั่วคราว";

    // Accordion 

    var accordionCloseButtonLabel = "ปิด";
 
    // Dialog

    var labelDialogClose = "ปิด";
    var labelDialogAudioDescription = "คำบรรยายเสียง";
    var labelDialogTranscriptHeading = "ถอดความ";
    var labelDialogTranscriptButton = "คำบรรยายวิดีโอ";
    var labelDialogVideo = "วิดีโอ";
    var labelDialogVideoSuffix = "(วิดีโอ)";
    var labelDialogTranscriptNotFound = "ไม่พบไฟล์ถอดเสียง";
    var labelDialogTranscriptFailed = "ไม่สามารถโหลดไฟล์ถอดเสียงได้";
    var labelDialogContentNotFound = "ไม่พบเนื้อหา";
    var labelDialogLoadingContent = "กำลังโหลดเนื้อหา...";
    var labelDialogContentFailed = "ไม่สามารถโหลดเนื้อหาได้";
    var labelDialogMissingNameHeading = "ชื่อที่เข้าถึงได้หายไป";
    var labelDialogMissingNameMessage = "ต้องระบุชื่อที่เข้าถึงได้ง่าย เพิ่ม data-label พร้อมค่าที่สื่อความหมาย หรือเพิ่ม data-labelledby เพื่อชี้ไปยัง id ที่มีอยู่แล้วในหน้าเว็บ หรือเพิ่ม data-dynamic-label เพื่อดึง id มาโดยอัตโนมัติ";
    var labelDialogVideoFallback = "เครื่องเล่นวิดีโอ";
    var labelDialogIframeFallback = "เนื้อหาที่ฝังตัว";

} else if (currentPageLanguage === "uk") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Опис аудіо";
    var atVideoLabel = "Фонова анімація";
    var atPauseButtonLabel = "Призупина анімація";

    // Accordion 

    var accordionCloseButtonLabel = "Закрити";

    // Dialog

    var labelDialogClose = "Закрити";
    var labelDialogAudioDescription = "Аудіоопис";
    var labelDialogTranscriptHeading = "Стенограма";
    var labelDialogTranscriptButton = "Відеотранскрипт";
    var labelDialogVideo = "Відео";
    var labelDialogVideoSuffix = "(Відео)";
    var labelDialogTranscriptNotFound = "Транскрипт не знайдено.";
    var labelDialogTranscriptFailed = "Не вдалося завантажити транскрипт.";
    var labelDialogContentNotFound = "Контент не знайдено.";
    var labelDialogLoadingContent = "Завантаження контенту...";
    var labelDialogContentFailed = "Не вдалося завантажити контент.";
    var labelDialogMissingNameHeading = "Відсутнє ім'я для людей з обмеженими можливостями";
    var labelDialogMissingNameMessage = "Потрібно вказати доступне ім'я. Додайте data-label з описовим значенням, data-labeld, вказуючи на ідентифікатор, який уже присутній на сторінці, або data-dynamic-label, щоб отримати його автоматично.";
    var labelDialogVideoFallback = "Відеоплеєр";
    var labelDialogIframeFallback = "Вбудований контент";

} else if (currentPageLanguage === "vi") {

    // Animation Toggle

    var atAudioDescriptionLabel = "Mô tả âm thanh";
    var atVideoLabel = "Hoạt hình nền";
    var atPauseButtonLabel = "Tạm dừng hoạt hình";

    // Accordion 

    var accordionCloseButtonLabel = "Đóng";
  
    // Dialog

    var labelDialogClose = "Đóng";
    var labelDialogAudioDescription = "Mô tả âm thanh";
    var labelDialogTranscriptHeading = "Bản ghi";
    var labelDialogTranscriptButton = "Bản ghi video";
    var labelDialogVideo = "Băng hình";
    var labelDialogVideoSuffix = "(Băng hình)";
    var labelDialogTranscriptNotFound = "Không tìm thấy bản ghi.";
    var labelDialogTranscriptFailed = "Bản ghi không tải được.";
    var labelDialogContentNotFound = "Không tìm thấy nội dung.";
    var labelDialogLoadingContent = "Đang tải nội dung...";
    var labelDialogContentFailed = "Nội dung không tải được.";
    var labelDialogMissingNameHeading = "Tên có thể truy cập bị thiếu";
    var labelDialogMissingNameMessage = "Cần cung cấp một tên dễ truy cập. Thêm thuộc tính `data-label` với giá trị mô tả, `data-labelledby` trỏ đến một ID đã có trên trang hoặc `data-dynamic-label` để tự động lấy ID đó.";
    var labelDialogVideoFallback = "Trình phát video";
    var labelDialogIframeFallback = "Nội dung nhúng";

} else { 

    // English (Default)

    // Animation Toggle

    var atAudioDescriptionLabel = "Audio Description";
    var atVideoLabel = "Background Animation";
    var atPauseButtonLabel = "Pause Animation";

    // Accordion 

    var accordionCloseButtonLabel = "Close";

    // Dialog

    var labelDialogClose = "Close";
    var labelDialogAudioDescription = "Audio Description";
    var labelDialogTranscriptHeading = "Transcript";
    var labelDialogTranscriptButton = "Video Transcript";
    var labelDialogVideo = "Video";
    var labelDialogVideoSuffix = "(Video)";
    var labelDialogTranscriptNotFound = "Transcript not found.";
    var labelDialogTranscriptFailed = "Transcript failed to load.";
    var labelDialogContentNotFound = "Content not found.";
    var labelDialogLoadingContent = "Loading content...";
    var labelDialogContentFailed = "Content failed to load.";
    var labelDialogMissingNameHeading = "Accessible Name Missing";
    var labelDialogMissingNameMessage = "An accessible name must be provided. Add data-label with a descriptive value, data-labelledby pointing to an id already present on the page, or data-dynamic-label to fetch one automatically.";
    var labelDialogVideoFallback = "Video Player";
    var labelDialogIframeFallback = "Embedded Content";

}
