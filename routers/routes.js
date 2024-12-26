const router=require("express").Router()
const {kullanici_ekle,login, kullanici_getir,satis_getir,kullaniciByEposta, siparis_getir,getOrdersBetweenDates}=require("../controllers/controllers")
router.post("/login",login)
router.post("/register",kullanici_ekle)
router.get("/kullanici_getir",kullanici_getir)
router.get("/satis_getir",satis_getir)
router.get("/kullanici_getir/:eposta",kullaniciByEposta)
router.get("/siparis_getir",siparis_getir)
router.get("/siparis_tarih", getOrdersBetweenDates);

module.exports=router