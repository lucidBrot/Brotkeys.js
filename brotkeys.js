// (c) Eric Mink aka LucidBrot 2018
class HotkeyManager {
    // more than one instance will probably mess with hotkey library scopes. This class is just to not poison the JS scope with variable names.
	
	/*
		wordMap: Map of [strings that exist on the page, functions as reaction on the string]
			If a word starts with another word, the shorter will not leave fmode when its function is called.
		interruptMap: Map of [char, function]
	*/
	constructor(wordMap, interruptMap){
		// initialize the string of what the user has entered to nothing
		this.current_link_word = "";
		// set up the value for entering f_mode
		this.F_MODE_PREFIX_CHAR = "f";
		// fake enum for easier changes instead of magic strings
		this.ModeEnum = Object.freeze({"f_mode":1, "pre_f_mode":2, "all_disabled":3});
		// this.mode is used to distinguish between no f pressed yet, and when the user is entering the actual word. Avoids using hotkeys.setScope()
		this.mode = this.ModeEnum.pre_f_mode;
		
		/*public*/ this.log_prefix = ""; // set this if you want. It's only used for logging
		
		// set up special keys that will interrupt the search for words at any time (and should thus not be used within valid words)
		this.interruptMap_whenInFMode = interruptMap;

		this.wordMap = wordMap;
		
		// config for key case insensitivity
		this.fmode_caseInsensitivity = true;
		this.interrupt_caseInsensitivity = true;
		this.word_caseInsensitivity = true;
		this.ignore_ShiftAndCapslock_inWordMode = true; 
		
		// fake enum for adding more options later, for autogeneration of link hints
		// never use 0 in enums, since it could compare as equal to null or undefined or false
		this.GenerationEnum = Object.freeze({"tag_anchor":0b01,"class_tagged":0b10});
		this.generationClassTag = "BKH"; // default for class_tagged is the class "BKH", but this could be easily changed
        this.AUTOGEN_LINKHINT_ATTRIBUTE = "brotkeysid";
		
		this.hotkeys_init();
	}
	
	log_verbose(text){
		console.log(this.log_prefix+text);
	}
	log_error(text){
		console.log("%c[E] "+this.log_prefix+text, 'background: #222; color: #bada55');
	}
	log_happy(text){
		/*
			https://stackoverflow.com/a/21457293/2550406
			(c) bartburkhardt cc-by-sa 3.0
		*/
        const css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";
        console.log("%c%s", css, this.log_prefix+text);
	}
	enter_f_mode(){
		this.mode = this.ModeEnum.f_mode;
		this.callNotifyFModeFunction(true);
	}
	leave_f_mode(){
		this.current_link_word = "";
		this.mode = this.ModeEnum.pre_f_mode;
		this.callNotifyFModeFunction(false);
	}
	abort_f_mode(){
		this.log_verbose("Abort f mode");
		this.leave_f_mode();
	}
	disable(){ // disables all reactions to key presses. Call enable_f_mode() with either true or false to re-enable again.
		this.mode = this.ModeEnum.all_disabled;
	}
	// The name says "enable f mode", but the internal workings are actually just setting fmode to always be on if it is disabled.
	// enabled = true means that the first character will not be part of the word but instead launch the listening for the word
	enable_f_mode(enabled){ // true by default
		if(enabled){
			this.leave_f_mode = function(){
				this.current_link_word = "";
				this.mode = this.ModeEnum.pre_f_mode;
			};
			this.leave_f_mode();
		} else {
			this.leave_f_mode = function(){
				this.current_link_word = "";
				this.mode = this.ModeEnum.f_mode;
			};
			this.leave_f_mode();
		}
	}
	set_f_mode_character(character){
		if(character.length !== 1){this.log_error("set_f_mode_character("+character+") failed because it is not a single character");}
		else {
			this.F_MODE_PREFIX_CHAR = character;
		}
	}
	setNotifyMeFunction(notifyFunc /*params: (current_word ,remaining_words_possible)*/){
		if(notifyFunc===undefined){
			this.notifyMeFunc = undefined;
			return;
		}
		if(!(notifyFunc.length===2)){this.log_error("NotifyMe function does not accept the right number of parameters");}
		this.notifyMeFunc = notifyFunc;
	}
	callNotifyMeFunction(current_word, remaining_words_possible){
		if(this.notifyMeFunc !== undefined){
			this.notifyMeFunc(current_word, remaining_words_possible);
		}
	}
	setNotifyFModeFunction(fmodeNotifyFunc /*params: (bool_entering_fmode)*/){
		this.notify_f_mode_function = fmodeNotifyFunc;
	}
	callNotifyFModeFunction(entering_fmode){
		if(this.notify_f_mode_function!==undefined){
			this.notify_f_mode_function(entering_fmode);
		}
	}
	continue_link_access(key){
		if(this.word_caseInsensitivity){key = key.toLowerCase();}
		this.current_link_word += key;
        const link_words = Array.from(this.wordMap.keys());

        // find out whether and more importantly at which index there are remaining possibilities
        let counter = 0;
        let index = -1;
        let i;
        let notify_words_possible = [];
        for(i=0; i<this.wordMap.size; i++){
			if(link_words[i].startsWith(this.current_link_word)){
				counter++; notify_words_possible.push(link_words[i]);
				index = i;
			}
			// if there are multiple possibilities, we can wait for more user input
			if(counter>1){
				// unless the currently finished word is a subset of the future words. In that case, execute the word without leaving f_mode
                let func = this.wordMap.get(this.current_link_word);

                // notify before executing
				this.callNotifyMeFunction(this.current_link_word, notify_words_possible);
				
				// noinspection EqualityComparisonWithCoercionJS
                if(func != undefined){
					this.log_verbose("The word \""+this.current_link_word+"\" is the start of a longer word. Executing it without leaving fmode.");
					func();
				}
				return;
			}
		}
		// notify before potentially executing
		this.callNotifyMeFunction(this.current_link_word, notify_words_possible);
		
		if(counter === 0){
			if(this.ignore_ShiftAndCapslock_inWordMode && (key==="shift" || key==="capslock")){
				// ignore shift or capslock key if we're in word mode and it was not specified in the remaining possible words
				this.log_verbose("ignoring "+key+" because there are no possible matches containing it and this.ignore_ShiftAndCapslock_inWordMode equals true");
				this.current_link_word = this.current_link_word.slice(0, -(key.length)); // remove last character again
				return;
			}
			this.log_verbose(key+" not found in available word options. Leaving f_mode.");
			this.leave_f_mode();
			return;
		}
		
		// counter equals 1
		// it's obvious now what we will access, but we only do that if the user has typed the whole word
		if(this.current_link_word.length === link_words[index].length){
			this.wordMap.get(this.current_link_word)(); // execute stored function
			this.leave_f_mode();

		} else {
			// TODO: optimization possible in case where we don't want notifications: store the obvious word

		}
	}
	/*boolean*/ shouldInterruptOnKey(eventkey){
		if(this.interrupt_caseInsensitivity){eventkey = eventkey.toLowerCase();}
		return Array.from(this.interruptMap_whenInFMode.keys()).includes(eventkey);
	}
	executeInterruption(eventkey){
		if(this.interrupt_caseInsensitivity){eventkey = eventkey.toLowerCase();}
		this.interruptMap_whenInFMode.get(eventkey)();
	}
	/*boolean*/ shouldEnterFModeOnKey(eventkey){
		if(this.fmode_caseInsensitivity){eventkey = eventkey.toLowerCase();}
		// noinspection EqualityComparisonWithCoercionJS
        return (eventkey == this.F_MODE_PREFIX_CHAR);
	}
	
	hotkeys_handler_on_key_press(event, handler, that){
		switch(that.mode){
			case that.ModeEnum.f_mode:
				if(that.shouldInterruptOnKey(event.key)){
					that.executeInterruption(event.key);
				} else {
					that.continue_link_access(event.key);
				}
				break;
			case that.ModeEnum.pre_f_mode:
				if(that.shouldEnterFModeOnKey(event.key)){
					that.callNotifyMeFunction(""/*empty current word*/, Array.from(that.wordMap.keys()) /*all words still possible*/);
					that.enter_f_mode();
				}
				break;
			case that.ModeEnum.all_disabled: // just for completeness. if disabled, this shouldn't even be called.
				break;
			default:
				this.log_error("[W:] hotkeys encountered unexpected mode");
		}
	}
	hotkeys_init(){
        const that = this; // because "this" changes value in different functions, but "that" remains this.
		
		// treats any capital key like a lowercase key, handles all key presses
		// noinspection JSUnresolvedFunction
        hotkeys('*', function(event, handler){that.hotkeys_handler_on_key_press(event, handler, that)});

		this.current_link_word="";
	}
	
	// Automatic generation of link hints in f-mode
	
	// Param: generationTarget can be any of the HotkeyManager.GenerationEnum, bitwise OR'ed together.
	// If an element is of tag type <a> (anchor) AND of class "BKH", it will be treated only once, even if both are specified.
    // at time of writing this (24.08.2018), the only options are class_tagged (with class name BKH) and tag_anchor
	autogenerate(generationTarget) {
        // fetch list of elements to be worked on
        let elems_to_gen;
        let g;
        fetching_elems:
        {
			// every bit corresponds to one flag. Test if the relevant bit is set.
			// noinspection JSBitwiseOperatorUsage
            if ((generationTarget & this.GenerationEnum.class_tagged) === this.GenerationEnum.class_tagged) {
				elems_to_gen = document.getElementsByClassName(this.generationClassTag);
				g = "classes tagged "+this.generationClassTag;
				break fetching_elems;
			}
			// noinspection JSBitwiseOperatorUsage
            if ((generationTarget & this.GenerationEnum.tag_anchor) === this.GenerationEnum.tag_anchor) {
                elems_to_gen = document.getElementsByTagName("a");
                g = "anchor elements";
                break fetching_elems;
			}
			/*default:*/ break fetching_elems;
    	}
    	// fetching elements done. They are now in elems_to_gen, which is a HTMLCollection
		this.log_verbose("Autogenerating for the "+g+". ");

        const num_elems_to_gen_for = elems_to_gen.length + this.wordMap.size; // need to fit at least this many link hints
		let brotkeys_elem_id = 0;
		// For each element, create a tag
        [...elems_to_gen].forEach(function(item, index){
			const curr_bk_elem_id = brotkeys_elem_id;
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            let link_hint_text = this.generateLinkHintText(item, num_elems_to_gen_for); // generate link hint
			item.setAttribute(this.AUTOGEN_LINKHINT_ATTRIBUTE, index); // give it a unique id based on index
            let f = new Function("document.querySelector(\"a["+this.AUTOGEN_LINKHINT_ATTRIBUTE+"='"+curr_bk_elem_id+"']\").click();");
            this.wordMap.set(link_hint_text, f);  // current value in wordMap is there, but action is undefined. Set up action.
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            this.addBeautifulLinkHint(item, link_hint_text); // add the graphics
            brotkeys_elem_id++;
		}.bind(this));
	}

	// Returns an unused link hint
	/*String*/ generateLinkHintText(element, num_elems_to_gen_for){
        // noinspection JSUnusedLocalSymbols
        let unavailable_words = Array.from(this.wordMap, ([word, action]) => word);
        let homerow_chars = ['f', 'j', 'd', 'f', 's', 'g', 'h', 'k','l'];
        let other_okay_chars = ['q','w','e','r','t','u','i','o','p','v','n','m'];
        // get rid of important function keys
        homerow_chars = homerow_chars.filter(char => char !== this.F_MODE_PREFIX_CHAR);
        other_okay_chars = other_okay_chars.filter(char => char !== this.F_MODE_PREFIX_CHAR);
        // compute the minimal number of letters needed
        const letters = homerow_chars.concat(other_okay_chars);
        // {num_letters}^{min_length} = num_possible_words  ===>  min_length = log_{num_letters}{num_possible_words}
        const min_length = Math.ceil(Math.log(num_elems_to_gen_for)/Math.log(letters.length));

        // compute an available word of minimal length, favoring the homerow chars.
        let position = min_length-1;

        // first, set up storage and an initial guess
        let word;
        // word is an array which contains the character index of each letter
        // noinspection EqualityComparisonWithCoercionJS
        if (this._generateLinkHintText_lastWordGenerated != undefined){
            word = this._generateLinkHintText_lastWordGenerated;

            // continue later at the position where this stored word left off
			// It's a surefire wrong guess, but it's a good enough guess (close enough to actual values)
			// (The logic is that this was set last time and we advance in order)
        } else {
            // start at the start
            word = Array(min_length).fill(0);
        }

        function to_word(word_array){let w="";// noinspection JSUnusedLocalSymbols
            word_array.forEach(function(letter_number, elem_index){w = w.concat(letters[letter_number])});
            return w;
        }

        // recursive search
		let initial_guess = word.slice();
        word = this.recGenWordGo(letters, unavailable_words, initial_guess); // resulting word must be a word array
        if(word === null){
        	this.log_error("Failed to generate a link hint of length "+initial_guess.length+" when only considering words 'smaller' than "+to_word(initial_guess));
		}

        // keep track of the last word array generated, in case there are many
        this._generateLinkHintText_lastWordGenerated = word;

        let w = to_word(word);

        // add the word to the unavailable words, but don't add an action yet
		this.wordMap.set(w,undefined);

        // and return the generated word
        return String(w);
    }

    // finds a word_array of length of the initial attempt, or null
	// avoids any options "below" the initial attempt
    recGenWordGo(letters, not_ok_words, initial_attempt){
		if(initial_attempt.some(elem => ((elem >= letters.length) || elem < 0) && this.log_error("[recGenWordGo] initial attempt is not allowed to be "+elem))){
			return null;
		}

		// string from array
        function word(word_array){let w="";// noinspection JSUnusedLocalSymbols
            word_array.forEach(letter_index => w = w.concat(letters[letter_index]));
            return w;
        }
        // boolean
		function is_ok_word(word_array){
			return (!not_ok_words.includes(word(word_array)));
		}

        if(initial_attempt.length <= 0){return null;}
		if(is_ok_word(initial_attempt)){return initial_attempt;}
        return this.recGenWord(letters, initial_attempt, is_ok_word);
	}

    // returns the word array, if found, or null
    recGenWord (/*char_array*/ letters, /*int_array*/ initial_attempt, /*function*/ is_ok_word){
		// case : available word can be found by just modifying the last digit
		let last_digit; let found_word = null;
        let current_attempt = initial_attempt;
		for(last_digit = initial_attempt[initial_attempt.length-1]; last_digit < letters.length; last_digit++){
			current_attempt[current_attempt.length -1] = last_digit;
			if(is_ok_word(current_attempt)){found_word = current_attempt; break;}
		}
		if(found_word != null){
			return found_word;
		} else {
			if(initial_attempt.length <= 1){
				return null;
			}
		}
		// case : we need to try all options of the left digits for all options of the rightmost digit
		// 	      i.e. we first try to modify only the 2 rightmost digits, then 3, etc.
		// deeper recursive calls try the rightmost
		if(initial_attempt.length <= 1){
			console.log("[W] [recGenWord] You aren't supposed to run this code.\n" +
				"initial_attempt: "+initial_attempt+"\n" +
				"current_attempt: "+current_attempt+"\n" +
				"found_word: "+found_word);
		}
		for(let left_digit = initial_attempt[0]; left_digit < letters.length; left_digit++) {
            let new_is_ok_word = (function(left_digit){return function (word_array) {
                if(word_array.length === 0){
                	console.log("word_array had length 0, so it's trivially an ok word.\n word_array: "+word_array);
                	return true;
                }
                // array with left digit as the leftmost entry of the upper call
                let expanded_word_array = word_array.slice();
                expanded_word_array.unshift(left_digit);
                return is_ok_word(expanded_word_array);
            };})(left_digit); // hack to enable function declaration within the for loop.
			// above is basically just     function new_is_ok_word (word_array) { ... }

			// find working word if the leftmost digit were fixed to left_digit
			// by recursing to only the right part and then prepend the left part again in the end.
            found_word = this.recGenWord(letters, initial_attempt.slice(1), new_is_ok_word);

            if(found_word !== null){
            	found_word.unshift(left_digit);
            	return found_word;
			} else {
            	// allow all numbers again after the first try, since we only block those above the first one
				// left_digit is updated as well (in the for loop head)
            	initial_attempt[initial_attempt.length -1]=0;
			}
        }
        return null; // not found

	}

    addLinkHint(element, linkHint){
		element.text += " [" + linkHint + "] ";
	}
	
	addBeautifulLinkHint(element, linkHint){
		this.addLinkHint(element, linkHint); // temporary
		element.innerHTML += `<kbd class=\"LB-SS-swap1 eric-reverse\">${linkHint}</kbd>`
	}
	
	// uses global variable _brotkeysjs__src__path;
	loadNeededJSCSSForStyleSwapping(){
		var scripts = document.getElementsByTagName("script");
		var jsFileLocation = _brotkeysjs__src__path.replace('brotkeys.js','');
		this.log_verbose("jsFileLocation "+jsFileLocation);
		
		// taken from http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
		function loadjscssfile(filename, filetype){
			if (filetype=="js"){ //if filename is a external JavaScript file
				var fileref=document.createElement('script')
				fileref.setAttribute("type","text/javascript")
				fileref.setAttribute("src", filename)
			}
			else if (filetype=="css"){ //if filename is an external CSS file
				var fileref=document.createElement("link")
				fileref.setAttribute("rel", "stylesheet")
				fileref.setAttribute("type", "text/css")
				fileref.setAttribute("href", filename)
			}
			if (typeof fileref!="undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref)
		}
		/* 
		USAGE:
		loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
		loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file
		*/
		loadjscssfile(jsFileLocation+"keys.css", "css");
	}
	
	showKeys(pls_show_keys, of_class){
		var new_display = pls_show_keys ? "inline" : "none";
		for (elem of document.getElementsByClassName(of_class)) {elem.style.display=new_display;}
	}
	
}

var _brotkeysjs__src__path;
function _brotkeys_global_init(){ // get script tag that is the last at current evaluation time
	var scripts = document.getElementsByTagName("script");
	_brotkeysjs__src__path = scripts[scripts.length-1].src;
}
_brotkeys_global_init();

function brotkeys_autogenerate_everything(){
	var manager;
	// words of the form [f]abcdefg unless enable_f_mode is set to false
	// DONT INCLUDE AN UPPERCASE X, because that is used to immediately abort f mode here. (Because it's set below)
	var wordMap = new Map([
		// define some manually made input/action pairs
		["secret", function(){window.open("https://github.com/lucidBrot/Brotkeys.js", "_self");}],
	]);
	// single characters that can interrupt at any time during the word-typing mode
	var interruptMap = new Map([
		["X", function(){manager.abort_f_mode();}], // abort fmode on fX
		["D", function(){console.log("user disabled shortcuts"); manager.disable();}], // completely disable Brotkeys on fD
	]);

	manager = new HotkeyManager(wordMap, interruptMap);
	manager.interrupt_caseInsensitivity = false; // case sensitive
	
	// load neccessary css for style swapping (needed for showing link hints with the internal manager.addBeautifulLinkHints)
	manager.loadNeededJSCSSForStyleSwapping();
	
	// please notify me on entering and leaving fmode by calling this function.
	// This function causes the link hints to appear or disappear
	var notifyFModeFunc = function(entering){
		if(entering){
			showKeys(true, "LB-SS-swap1"); //important: this class must be defined in an _external_ css file.
		} else {
			showKeys(false, "LB-SS-swap1");
		}
	};
	manager.setNotifyFModeFunction(notifyFModeFunc);
	manager.log_prefix = "[M1] ";
	
	manager.autogenerate(manager.GenerationEnum.tag_anchor); // autogenerate tags
}

/*
	TODO: does it work with the class BHK instead of anchors?
	TODO: does it work with images?
	TODO: what happens when user types in text fields?
	TODO: make link buttons take no space until visible
	TODO: why does "abort f mode" log twice?"
	TODO: run autogenerate in summaries.html
	TODO: for (elem of document.getElementsByClassName('LB-SS-swap1')) {elem.style.display="inline";}
	TODO: documentation, example page
*/