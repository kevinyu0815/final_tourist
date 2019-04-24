// 取得Element
var body = document.querySelector("body");
var select_area = document.querySelector(".header-select");
var btn_area = document.querySelectorAll(".header-topArea .btn");
var areaTitle = document.querySelector(".main-title");
var list = document.querySelector(".main-list");
var data = [];

// Ajax
var xhr = new XMLHttpRequest();
xhr.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", true);
xhr.send(null);
xhr.onload = function () {
	// 取得資料陣列
	data = JSON.parse(xhr.response).result.records;
	console.log(data);
	// select顯示所有資料地點
	str = `<option value="--請選擇行政區--" disabled selected>--請選擇行政區--</option>`;
	for (name of allAreaName()) {
		str += `<option value="${name}">${name}</option>;`;
	}
	select_area.innerHTML = str;
	// 顯示所有景點
	update();

	// 綁事件：所有按紐/選單
	for (var btn of btn_area) {
		btn.addEventListener("click", update);
	}
	select_area.addEventListener("change", update);

	// body.addEventListener("keydown", function(e){
	// 	if (e.keyCode == "65") update();
	// })
}



function allAreaName() {
	var all = [];
	for (var item of data) {
		all.push(item.Zone);
	}
	// 把重複的篩掉
	// all = [...new Set(all)];
	all = all.filter((e, i) => all.indexOf(e) == i);
	return all;
}

// 更新function
function update(e) {
	// 取得並顯示所點擊的區域名稱
	var area = "所有景點";
	if (e) {
		area = (e.type == "change") ? e.target.value : e.target.textContent;
	}
	areaTitle.textContent = area;

	// API所需資料：Name(名稱)/Zone(區)/Opentime(時間)/Add(地址)/Tel(電話)/TicketInfo(是否免費)
	var name, zone, time, add, tel, ticket, pic = "";
	var str = "";
	// 跑每筆，取得所需資料，顯示於畫面上
	for (var item of data) {
		if (item.Zone == area || area == "所有景點") {
			name = item.Name;
			zone = item.Zone;
			time = item.Opentime;
			add = item.Add;
			tel = item.Tel;
			ticket = item.Ticketinfo;
			pic = item.Picture1;
			str += getList(name, zone, time, add, tel, ticket, pic);
			// console.log(name, zone, time, add, tel, ticket);
			// console.log(item);
		}
	}
	list.innerHTML = str;
}

// 取得list的html
function getList(name, zone, time, add, tel, ticket, pic) {
	var listStr = `<li>
                <div class="list-header" style='background: linear-gradient(rgba(255, 255, 255, 0), rgba(0,0,0,0.3)), url(${pic}) center center; background-size: cover;'>
                    <div class="title">
                        ${name}<span>${zone}</span>
                    </div>
                </div>
                <div class="list-content">
                    <div class="info">
                        <div class="icon"><img src="img/icons_clock.png" alt=""></div>
                        <div class="time">${time}</div>
                    </div>
                    <div class="info">
                        <div class="icon"><img src="img/icons_pin.png" alt=""></div>
                        <div class="address">${add}</div>
                    </div>
                    <div class="info">
                        <div class="icon"><img src="img/icons_phone.png" alt=""></div>
                        <div class="phone">${tel}</div>
                    </div>
                    <div class="tag">
                        <div class="icon"><img src="img/icons_tag.png" alt=""></div>
                        ${ticket}
                    </div>
                </div>
			</li>`;
	return listStr;
}