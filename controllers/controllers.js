const dbConn=require("../db/mysql_connect")
const kullanici_ekle = async (req, res) => {
    try {
        const ad_soyad=req.body.ad_soyad
        const eposta=req.body.eposta
        const kullanici_sifre=req.body.kullanici_sifre
        const kullanici_yetki_id=req.body.kullanici_yetki_id
        const tarih=req.body.tarih
        // Mevcut kullanıcı kontrolü
        const [existingUsers] = await dbConn.query("SELECT * FROM kullanicilar WHERE eposta=?", [eposta]);
        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                data: req.body,
                message: "Kayıt Mevcut",
            });
        }

        // Yeni kullanıcı ekleme
        const [insertResult] = await dbConn.query(
            "INSERT INTO kullanicilar (ad_soyad, eposta, kullanici_sifre, kullanici_yetki_id, tarih) VALUES (?, ?, ?, ?, ?)",
            [ad_soyad, eposta, kullanici_sifre, kullanici_yetki_id, tarih]
        );

        return res.status(201).json({
            success: true,
            data: req.body,
            message: "Kayıt Gerçekleşti",
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Bir hata oluştu",
        });
    }
};

const login=async(req,res)=>{
    const eposta=req.body.eposta
    const kullanici_sifre=req.body.kullanici_sifre
    const [results] = await dbConn.query("SELECT * FROM kullanicilar WHERE eposta=? AND kullanici_sifre=?",[eposta,kullanici_sifre])
        if(results.length>0){
            return res.status(201).json({
                success:true,
                data:null,
                message:"Giriş Başarılı"
            })
        }else{
            return res.status(401).json({
                success:false,
                data:null,
                message:"Kullanıcı Adı veya Şifre Hatalı"
            })
        }
}
const kullanici_getir = async (req, res) => {
    try {
        const [result] = await dbConn.query("SELECT * FROM kullanicilar");
        res.json(result);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Kullanıcılar getirilemedi" });
    }
};

const satis_getir=async(req,res)=>{
    try {
        const [results] = await dbConn.query("SELECT sales_date, sales_amount FROM sales_data");
        res.json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            success: false,
            message: "Veri alınamadı",
        });
}
}
const kullaniciByEposta = async (req, res) => {
    const eposta=req.params.eposta
    try {
        // Belirli ID'ye göre kullanıcıyı sorgula
        const [results] = await dbConn.query("SELECT * FROM kullanicilar WHERE eposta = ?", [eposta]);

        if (results.length > 0) {
            return res.status(200).json({
                success: true,
                data: results[0], // İlk kullanıcıyı döndür
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            success: false,
            message: "Bir hata oluştu",
        });
    }
};

const siparis_getir=async(req,res)=>{
    try {
        const [results] = await dbConn.query("SELECT * FROM orders");
        return res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            success: false,
            message: "Siparişler alınamadı",
        });
    }
}

const getOrdersBetweenDates = async (req, res) => {
    const { startDate, endDate } = req.query; // Path parametrelerinden alıyoruz

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: "Başlangıç ve bitiş tarihleri gereklidir",
        });
    }

    try {
        const [results] = await dbConn.query(
            "SELECT * FROM orders WHERE order_date BETWEEN ? AND ?",
            [startDate, endDate]
        );
        return res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            success: false,
            message: "Veriler alınamadı",
        });
    }
};

module.exports={kullanici_ekle,login,kullanici_getir,satis_getir,kullaniciByEposta,siparis_getir,getOrdersBetweenDates}