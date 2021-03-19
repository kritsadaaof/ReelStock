using Rotativa;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ZXing;
namespace Production.Controllers
{
    public class ProductionController : Controller
    {
        // GET: Reel
        public ActionResult PD_Request()
        {
            return View();
        }
 
    }
}