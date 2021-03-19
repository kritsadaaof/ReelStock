using Rotativa;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ZXing;
using ReelStock.Models;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ReelStock.Controllers
{
    public class ReelController : Controller
    {
        private Reel_StockEntities DbFile = new Reel_StockEntities();
        // GET: Reel
        public ActionResult Index()
        {
            ViewBag.ReelSize = DbFile.Master_Reel_Bom.Where(a => a.Status.Equals("T")).ToList();
            return View();
        }

        public ActionResult Stock()
        {
            return View();
        }
        public ActionResult StockWIP()
        {
            return View();
        }
        public ActionResult PD_Request()
        {
            return View();
        }

        public ActionResult Move()
        {
            return View();
        }
        public ActionResult Reel_Location()
        {
            return View();
        }
        public string MoveLocation()
        {
            return null;
        }
        public string CheckBar(string BARCODE)
        {
            var data = DbFile.Reel_TR_RegisReel.Where(a => a.Reel_Code.Equals(BARCODE)).FirstOrDefault();
            if (data == null)
            {
                return "F";
            }
            else
            {
                return "S";
            }

        }
        public string CheckLoc(string LOCATION)
        {
            var data = DbFile.Master_Location.Where(a => a.Lo_Code.Equals(LOCATION)).FirstOrDefault();
            if (data == null)
            {
                return "F";
            }
            else
            {
                return data.Lo_Name;
            }

        } 
        public string GetDATAstock()
        {
            try
            { 
                var data = (from d in DbFile.Reel_TR_RegisReel
                            where d.Reel_Status.Equals("T")
                            select new
                            {
                                Location= d.Reel_Location, 
                                d.Reel_Size
                            }).AsEnumerable().GroupBy(k => new { k.Reel_Size,k.Location }).Select(x => new{
                                Location = x.Key.Location,
                                SUM = x.Count(),
                                Reel_Size = x.Key.Reel_Size 
                            }).ToList();

                string jsonlog = JsonConvert.SerializeObject(data, new IsoDateTimeConverter());
                return jsonlog;
            }
            catch { return null; }
        }
        public string GetDATAstockBysize(string SIZE,string LOCATION)
        {
            try
            {
                var data = (from d in DbFile.Reel_TR_RegisReel
                            where d.Reel_Size.Equals(SIZE)&&d.Reel_Location.Equals(LOCATION)
                            select new
                            {
                                d.Reel_Code,
                                d.Reel_Size,
                                Reel_DateCreate= d.Reel_DateCreate.ToString().Substring(0,16),

                            }).ToList();

                string jsonlog = JsonConvert.SerializeObject(data, new IsoDateTimeConverter());
                return jsonlog;
            }
            catch { return null; }
        }
        
        public string CheckUser(string USER)
        {
            try
            {
                var data = DbFile.Master_Member.Where(a => a.Code_Mem.Equals(USER)).Take(1).ToList();
                string jsonlog = new JavaScriptSerializer().Serialize(data);
                return jsonlog;
            }
            catch
            {
                return null;
            }
        }
        public string SaveReel(string id, string USER)
        {
            // var data = DbFile.Reel_TR_RegisReel.Where(a => a.Reel_Size.Equals(id)).FirstOrDefault();
            int Barcode = 0;
            var BD = DateTime.Now.ToString().Substring(8, 2) + DateTime.Now.ToString().Substring(3, 2);
            var CheckCode = DbFile.Reel_TR_RegisReel.Where(a => a.Reel_Code.StartsWith(BD)).OrderByDescending(x => x.Reel_Code).Take(1).SingleOrDefault();
            if (CheckCode == null)
            {
                Barcode = int.Parse(BD + "00001");
            }
            else
            {
                // Base = CheckLot.PRO_Lot.Substring(0, 2);
                Barcode = int.Parse(CheckCode.Reel_Code) + 1;
            }
            var TR_Regis_Reel = new Reel_TR_RegisReel();
            TR_Regis_Reel.Reel_Size = id;
            TR_Regis_Reel.Reel_Code = Barcode.ToString();//Bracode
            TR_Regis_Reel.Reel_DateCreate = DateTime.Now;
            TR_Regis_Reel.Reel_Location = "โรงประกอบ1";
            TR_Regis_Reel.Reel_Status = "T";
            TR_Regis_Reel.Reel_User = USER;
            DbFile.Reel_TR_RegisReel.Add(TR_Regis_Reel);
            DbFile.SaveChanges();
            return "s";
        }
        public string SaveMove(string BARCODE, string LOCATION,string USER)
        {
            try
            {
                var CheckLoc = DbFile.Master_Location.Where(a => a.Lo_Name.Equals(LOCATION) && a.Lo_Check.Equals("T")).FirstOrDefault();
                var CheckCode = DbFile.Reel_TR_RegisReel.Where(a => a.Reel_Code.Equals(BARCODE)).FirstOrDefault();
                var TR_Move = new Reel_TR_MoveLocation();
                if (CheckLoc == null)
                {
                    CheckCode.Reel_Status = "M";
                }
                else
                {
                    CheckCode.Reel_Status = "T";
                }
                CheckCode.Reel_Location = LOCATION;
                TR_Move.Move_Barcode = BARCODE;
                TR_Move.Move_User = USER;
                TR_Move.Move_Date = DateTime.Now;
                TR_Move.Move_Status = "T";
                TR_Move.Move_Location = LOCATION;
                TR_Move.Move_Size = CheckCode.Reel_Size;
                DbFile.Reel_TR_MoveLocation.Add(TR_Move);
                DbFile.SaveChanges();
                return "S";
            }
            catch { return "F"; }
        }
        public ActionResult PrintViewToPdf(string id)
        {
            try
            {
                //  var data = DbFile.Master_Item.Where(a => a.Barcode.Equals(id)).FirstOrDefault();

                var data = DbFile.Reel_TR_RegisReel.Where(a => a.Reel_Size.Equals(id)).OrderByDescending(a => a.Reel_DateCreate).FirstOrDefault();

                //   ViewBag.WMS_User = DbFile.WMS_PD_Master_User.Where(x => x.Code_Mem.Equals(data.PRO_Recive)).ToList();
                //  var report = new PartialViewAsPdf("~/Views/Stock/Form.cshtml", data);
                //  return new PartialViewAsPdf("~/Views/Reel/FormPrinBar.cshtml", data)
                return new PartialViewAsPdf("~/Views/Reel/FormPrinBar.cshtml", data)
                {
                    PageSize = Rotativa.Options.Size.A4,
                    PageOrientation = Rotativa.Options.Orientation.Landscape,
                    PageMargins = { Top = 1, Bottom = 0 },
                    PageHeight = 100,
                    PageWidth = 30

                };

            }
            catch { return null; }
        }

        public ActionResult RenderBarcode(string id)
        {
            // Session["aaaa"] = null;
            Image img = null;
            using (var ms = new MemoryStream())
            {
                var writer = new ZXing.BarcodeWriter() { Format = BarcodeFormat.CODE_128 };
                writer.Options.Height = 70;
                writer.Options.Width = 600;
                writer.Options.PureBarcode = true;
                img = writer.Write(id);
                img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                return File(ms.ToArray(), "image/jpeg");
            }
        }
    }
}