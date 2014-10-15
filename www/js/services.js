angular.module('inklusik.services', [])

.service('Player', function(ngAudio, $cordovaMedia) {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    var ctr = 1;
    function Player (name, url) {
        if (app) {
            var src = "/android_asset/www/sound/sunda/"+name+"/"+url+".mp3";

            var my_media = new Media(src, 
                function() { my_media.stop(); my_media.release();},
                function() { my_media.stop(); my_media.release();}); 
            my_media.play();
        } else {
            console.log("sound/sunda/"+name+"/"+url+".mp3");
            ngAudio.play("sound/sunda/"+name+"/"+url+".mp3");
        }
    }
    return Player;
})
.factory('Instruments', function() {
    var self = this;
    self.instruments = [ {
    description : "Angklung adalah alat musik multitonal (bernada ganda) yang secara tradisional berkembang dalam masyarakat Sunda di Pulau Jawa bagian barat. Alat musik ini dibuat dari bambu, dibunyikan dengan cara digoyangkan (bunyi disebabkan oleh benturan badan pipa bambu) sehingga menghasilkan bunyi yang bergetar dalam susunan nada 2, 3, sampai 4 nada dalam setiap ukuran, baik besar maupun kecil. Dictionary of the Sunda Language karya Jonathan Rigg, yang diterbitkan pada tahun 1862 di Batavia, menuliskan bahwa angklung adalah alat musik yang terbuat dari pipa-pipa bambu, yang dipotong ujung-ujungnya, menyerupai pipa-pipa dalam suatu organ, dan diikat bersama dalam suatu bingkai, digetarkan untuk menghasilkan bunyi. Angklung terdaftar sebagai Karya Agung Warisan Budaya Lisan dan Nonbendawi Manusia dari UNESCO sejak November 2010.",
    howtoplay : "Memainkan sebuah angklung sangat mudah. Seseorang tinggal memegang rangkanya pada salah satu tangan (biasanya tangan kiri) sehingga angklung tergantung bebas, sementara tangan lainnya (biasanya tangan kanan) menggoyangnya hingga berbunyi.",
    image : "angklung.jpg",
    imagecover: "angklung-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "angklung",
    story : "Tidak ada petunjuk sejak kapan angklung digunakan, tetapi diduga bentuk primitifnya telah digunakan dalam kultur Neolitikum yang berkembang di Nusantara sampai awal penanggalan modern, sehingga angklung merupakan bagian dari relik pra-Hinduisme dalam kebudayaan Nusantara. Catatan mengenai angklung baru muncul merujuk pada masa Kerajaan Sunda (abad ke-12 sampai abad ke-16). Asal usul terciptanya musik bambu, seperti angklung berdasarkan pandangan hidup masyarakat Sunda yang agraris dengan sumber kehidupan dari padi (pare) sebagai makanan pokoknya. Hal ini melahirkan mitos kepercayaan terhadap Nyai Sri Pohaci sebagai lambang Dewi Padi pemberi kehidupan (hirup-hurip). Masyarakat Baduy, yang dianggap sebagai sisa-sisa masyarakat Sunda asli, menerapkan angklung sebagai bagian dari ritual mengawali penanaman padi. Permainan angklung gubrag di Jasinga, Bogor, adalah salah satu yang masih hidup sejak lebih dari 400 tahun lampau. Kemunculannya berawal dari ritus padi. Angklung diciptakan dan dimainkan untuk memikat Dewi Sri turun ke bumi agar tanaman padi rakyat tumbuh subur. Jenis bambu yang biasa digunakan sebagai alat musik tersebut adalah bambu hitam (awi wulung) dan bambu putih (awi temen). Tiap nada (laras) dihasilkan dari bunyi tabung bambunya yang berbentuk bilah (wilahan) setiap ruas bambu dari ukuran kecil hingga besar. Dikenal oleh masyarakat sunda sejak masa kerajaan Sunda, di antaranya sebagai penggugah semangat dalam pertempuran. Fungsi angklung sebagai pemompa semangat rakyat masih terus terasa sampai pada masa penjajahan, itu sebabnya pemerintah Hindia Belanda sempat melarang masyarakat menggunakan angklung, pelarangan itu sempat membuat popularitas angklung menurun dan hanya dimainkan oleh anak- anak pada waktu itu. Selanjutnya lagu-lagu persembahan terhadap Dewi Sri tersebut disertai dengan pengiring bunyi tabuh yang terbuat dari batang-batang bambu yang dikemas sederhana yang kemudian lahirlah struktur alat musik bambu yang kita kenal sekarang bernama angklung. Demikian pula pada saat pesta panen dan seren taun dipersembahkan permainan angklung. Terutama pada penyajian Angklung yang berkaitan dengan upacara padi, kesenian ini menjadi sebuah pertunjukan yang sifatnya arak-arakan atau helaran, bahkan di sebagian tempat menjadi iring-iringan Rengkong dan Dongdang serta Jampana (usungan pangan) dan sebagainya. Dalam perkembangannya, angklung berkembang dan menyebar ke seantero Jawa, lalu ke Kalimantan dan Sumatera. Pada 1908 tercatat sebuah misi kebudayaan dari Indonesia ke Thailand, antara lain ditandai penyerahan angklung, lalu permainan musik bambu ini pun sempat menyebar di sana. Bahkan, sejak 1966, Udjo Ngalagena —tokoh angklung yang mengembangkan teknik permainan berdasarkan laras-laras pelog, salendro, dan madenda— mulai mengajarkan bagaimana bermain angklung kepada banyak orang dari berbagai komunitas."
  }, {
    description : "Kacapi merupakan alat musik Sunda yang dimainkan sebagai alat musik utama dalam Tembang Sunda atau Mamaos Cianjuran dan kacapi suling. Rincian unsur nada dalam sebuah kacapi parahu. Kata kacapi dalam bahasa Sunda juga merujuk kepada tanaman sentul, yang dipercaya kayunya digunakan untuk membuat alat musik kacapi.",
    howtoplay : "Kecapi merupakan alat musik petik yang menghasilkan suara ketika senar digetarkan. Tinggi rendah nada dihasilkan dari panjang pendeknya dawai.",
    image : "kacapi.jpg",
    imagecover: "kacapi-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "kacapi",
    story : "Alat musik kacapi lebih dikenal berasal dari China sejak berabad-abad lalu. Alat berdawai ini menjadi pengiring tembang-tembang merdu. Tak hanya di China, musik kacapi juga banyak di gunakan oleh beberapa pemusik tradisional di tanah air. Seperti halnya kebudayaan Sunda, alat kacapi merupakan alat musik kelasik yang selalu mewarnai beberapa kesenian di tanah Sunda ini. Membuat kacapi bukanlah hal gampang. Meski sekilas tampak kacapi seperti alat musik sederhana, tetapi membuatnya tidaklah gampang. Untuk bahan bakunya saja terbuat dari kayu Kenanga yang terlebih dahulu direndam selama tiga bulan. Sedangkan senarnya, kalau ingin menghasilkan nada yang bagus, harus dari kawat suasa (logam campuran emas dan tembaga), seperti kacapi yang dibuat tempo dulu. Berhubung suasana saat ini harganya mahal, senar Kacapi sekarang lebih menggunakan kawat baja."
  }, {
    description : "Kendang, kendhang, atau gendang adalah instrumen dalam gamelan Jawa Tengah yang salah satu fungsi utamanya mengatur irama. Instrument ini dibunyikan dengan tangan, tanpa alat bantu. Jenis kendang yang kecil disebut ketipung, yang menengah disebut kendang ciblon/kebar. Pasangan ketipung ada satu lagi bernama kendang gedhe biasa disebut kendang kalih. Kendang kalih dimainkan pada lagu atau gendhing yang berkarakter halus seperti ketawang, gendhing kethuk kalih, dan ladrang irama dadi. Bisa juga dimainkan cepat pada pembukaan lagu jenis lancaran ,ladrang irama tanggung. Untuk wayangan ada satu lagi kendhang yang khas yaitu kendhang kosek. Kendang kebanyakan dimainkan oleh para pemain gamelan profesional, yang sudah lama menyelami budaya Jawa. Kendang kebanyakan di mainkan sesuai naluri pengendang, sehingga bila dimainkan oleh satu orang denga orang lain maka akan berbeda nuansanya.",
    howtoplay : "Secara umum, cara membunyikan ricikan kendhang adalah dengan dikebuk membrannya menggunakan telapak tangan atau jari jari tangan kanan dan kiri.",
    image : "kendang.jpg",
    imagecover: "kendang-cover.jpg",
    location : "sunda",
    melody : [ "dung", "dung2", "tuk", "tung", "tungtaktung" ],
    name : "kendang",
    story : "Menurut bukti sejarah, kelompok membranofon telah populer di Jawa sejak pertengahan abad ke-9 Masehi dengan nama: padahi, pataha (padaha), murawaatau muraba, mrdangga, mrdala, muraja, panawa, kahala, damaru, kendang. Istilah ‘padahi’ tertua dapat dijumpai pada prasasti Kuburan Candi yang berangka tahun 821 Masehi (Goris, 1930). Seperti yang tertulis pada kitab Nagarakrtagama gubahan Mpu Prapanca tahun 1365 Masehi (Pigeaud, 1960), istilah tersebut terus digunakan sampai dengan jaman Majapahit."
  }, {
    description : "Akom adalah alat musik yang berbentuk seperti Angklung. Akan tetapi akom mempunyai ukuran yang lebih besar dan suara bass lebih terasa.",
    howtoplay : "Cara memainkannya seperti anglung. Seseorang tinggal memegang rangkanya pada salah satu tangan (biasanya tangan kiri) sehingga akom tergantung bebas, sementara tangan lainnya (biasanya tangan kanan) menggoyangnya hingga berbunyi.",
    image : "akom.jpg",
    imagecover: "akom-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "akom",
    story : "Tidak ada petunjuk sejak kapan akom digunakan, tetapi diduga bentuk primitifnya telah digunakan dalam kultur Neolitikum yang berkembang di Nusantara sampai awal penanggalan modern, sehingga akom merupakan bagian dari relik pra-Hinduisme dalam kebudayaan Nusantara. Catatan mengenai akom baru muncul merujuk pada masa Kerajaan Sunda (abad ke-12 sampai abad ke-16). Asal usul terciptanya musik bambu, seperti akom berdasarkan pandangan hidup masyarakat Sunda yang agraris dengan sumber kehidupan dari padi (pare) sebagai makanan pokoknya. Hal ini melahirkan mitos kepercayaan terhadap Nyai Sri Pohaci sebagai lambang Dewi Padi pemberi kehidupan (hirup-hurip). Masyarakat Baduy, yang dianggap sebagai sisa-sisa masyarakat Sunda asli, menerapkan akom sebagai bagian dari ritual mengawali penanaman padi. Permainan akom gubrag di Jasinga, Bogor, adalah salah satu yang masih hidup sejak lebih dari 400 tahun lampau. Kemunculannya berawal dari ritus padi. akom diciptakan dan dimainkan untuk memikat Dewi Sri turun ke bumi agar tanaman padi rakyat tumbuh subur. Jenis bambu yang biasa digunakan sebagai alat musik tersebut adalah bambu hitam (awi wulung) dan bambu putih (awi temen). Tiap nada (laras) dihasilkan dari bunyi tabung bambunya yang berbentuk bilah (wilahan) setiap ruas bambu dari ukuran kecil hingga besar. Dikenal oleh masyarakat sunda sejak masa kerajaan Sunda, di antaranya sebagai penggugah semangat dalam pertempuran. Fungsi akom sebagai pemompa semangat rakyat masih terus terasa sampai pada masa penjajahan, itu sebabnya pemerintah Hindia Belanda sempat melarang masyarakat menggunakan akom, pelarangan itu sempat membuat popularitas akom menurun dan hanya dimainkan oleh anak- anak pada waktu itu. Selanjutnya lagu-lagu persembahan terhadap Dewi Sri tersebut disertai dengan pengiring bunyi tabuh yang terbuat dari batang-batang bambu yang dikemas sederhana yang kemudian lahirlah struktur alat musik bambu yang kita kenal sekarang bernama akom. Demikian pula pada saat pesta panen dan seren taun dipersembahkan permainan akom. Terutama pada penyajian akom yang berkaitan dengan upacara padi, kesenian ini menjadi sebuah pertunjukan yang sifatnya arak-arakan atau helaran, bahkan di sebagian tempat menjadi iring-iringan Rengkong dan Dongdang serta Jampana (usungan pangan) dan sebagainya. Dalam perkembangannya, akom berkembang dan menyebar ke seantero Jawa, lalu ke Kalimantan dan Sumatera. Pada 1908 tercatat sebuah misi kebudayaan dari Indonesia ke Thailand, antara lain ditandai penyerahan akom, lalu permainan musik bambu ini pun sempat menyebar di sana. Bahkan, sejak 1966, Udjo Ngalagena —tokoh akom yang mengembangkan teknik permainan berdasarkan laras-laras pelog, salendro, dan madenda— mulai mengajarkan bagaimana bermain akom kepada banyak orang dari berbagai komunitas."
  } ];
    self.find = function(name) {
        return _.findWhere(self.instruments, {name : name});
    }
    return self;
});