var sample_data = {"af":"0","al":"0","dz":"0","ao":"0","ag":"0","ar":"0","am":"0","au":"0","at":"0","az":"0","bs":"0","bh":"21.73","bd":"105.4","bb":"0","by":"0","be":"0","bz":"0","bj":"0","bt":"0","bo":"0","ba":"0","bw":"0","br":"0","bn":"0","bg":"0","bf":"0","bi":"0","kh":"0","cm":"0","ca":"0","cv":"0","cf":"0","td":"0","cl":"0","cn":"0","co":"0","km":"0","cd":"0","cg":"0","cr":"0","ci":"0","hr":"0","cy":"0","cz":"0","dk":"0","dj":"0","dm":"0","do":"0","ec":"0","eg":"0","sv":"0","gq":"0","er":"0","ee":"0","et":"0","fj":"0","fi":"0","fr":"0","ga":"0","gm":"0","ge":"0","de":"0","gh":"0","gr":"0","gd":"0","gt":"0","gn":"0","gw":"0","gy":"0","ht":"0","hn":"0","hk":"0","hu":"0","is":"0","in":"0","id":"0","ir":"0","iq":"0","ie":"0","il":"0","it":"2036.69","jm":"13.74","jp":"5390.9","jo":"27.13","kz":"129.76","ke":"32.42","ki":"0.15","kr":"986.26","undefined":"5.73","kw":"117.32","kg":"4.44","la":"6.34","lv":"23.39","lb":"39.15","ls":"1.8","lr":"0.98","ly":"77.91","lt":"35.73","lu":"52.43","mk":"9.58","mg":"8.33","mw":"5.04","my":"218.95","mv":"1.43","ml":"9.08","mt":"7.8","mr":"3.49","mu":"9.43","mx":"1004.04","md":"5.36","mn":"5.81","me":"3.88","ma":"91.7","mz":"10.21","mm":"35.65","na":"11.45","np":"15.11","nl":"770.31","nz":"138","ni":"6.38","ne":"5.6","ng":"206.66","no":"413.51","om":"53.78","pk":"174.79","pa":"27.2","pg":"8.81","py":"17.17","pe":"153.55","ph":"189.06","pl":"438.88","pt":"223.7","qa":"126.52","ro":"158.39","ru":"1476.91","rw":"5.69","ws":"0.55","st":"0.19","sa":"434.44","sn":"12.66","rs":"38.92","sc":"0.92","sl":"1.9","sg":"217.38","sk":"86.26","si":"46.44","sb":"0.67","za":"354.41","es":"1374.78","lk":"48.24","kn":"0.56","lc":"1","vc":"0.58","sd":"65.93","sr":"3.3","sz":"3.17","se":"444.59","ch":"522.44","sy":"59.63","tw":"426.98","tj":"5.58","tz":"22.43","th":"312.61","tl":"0.62","tg":"3.07","to":"0.3","tt":"21.2","tn":"43.86","tr":"729.05","tm":0,"ug":"17.12","ua":"136.56","ae":"239.65","gb":"2258.57","us":"14624.18","uy":"40.71","uz":"37.72","vu":"0.72","ve":"285.21","vn":"101.99","ye":"30.02","zm":"15.69","zw":"5.57"};
getCountries().then((data) =>{
	for(country in data){
		sample_data[data.countryName] = data.bestScore
	}
});
