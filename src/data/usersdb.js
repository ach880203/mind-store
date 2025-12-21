// src/data/usersdb.js
const usersdb = [
  { id:1, name:"김민지", user_id:"minji", user_pw:"dummy", nick:"민지", phone:"010-1234-5678", admin:0, email:"minji@test.com", reg_date:"2025-01-01", address:"서울 강남구" },
  { id:2, name:"박준호", user_id:"junho", user_pw:"dummy", nick:"준호", phone:"010-2345-6789", admin:1, email:"junho@test.com", reg_date:"2025-01-02", address:"서울 송파구" },
  { id:3, name:"이서연", user_id:"seoyeon", user_pw:"dummy", nick:"서연", phone:"010-3456-7890", admin:0, email:"seoyeon@test.com", reg_date:"2025-01-03", address:"경기 성남시" },
  { id:4, name:"최현우", user_id:"hyunwoo", user_pw:"dummy", nick:"현우", phone:"010-9876-5432", admin:0, email:"hyunwoo@test.com", reg_date:"2025-01-04", address:"인천 남동구" },
  { id:5, name:"정유진", user_id:"yujin", user_pw:"dummy", nick:"유진", phone:"010-2222-3333", admin:0, email:"yujin@test.com", reg_date:"2025-01-05", address:"서울 마포구" },
  { id:6, name:"오지훈", user_id:"jihoon", user_pw:"dummy", nick:"지훈", phone:"010-3333-4444", admin:0, email:"jihoon@test.com", reg_date:"2025-01-06", address:"부산 해운대구" },
  { id:7, name:"한소연", user_id:"soyeon", user_pw:"dummy", nick:"소연", phone:"010-4444-5555", admin:0, email:"soyeon@test.com", reg_date:"2025-01-07", address:"대구 수성구" },
  { id:8, name:"김도윤", user_id:"doyoon", user_pw:"dummy", nick:"도윤", phone:"010-5555-6666", admin:0, email:"doyoon@test.com", reg_date:"2025-01-08", address:"광주 북구" },
  { id:9, name:"윤지수", user_id:"jisoo", user_pw:"dummy", nick:"지수", phone:"010-6666-7777", admin:0, email:"jisoo@test.com", reg_date:"2025-01-09", address:"대전 서구" },
  { id:10, name:"서준혁", user_id:"junhyuk", user_pw:"dummy", nick:"준혁", phone:"010-7777-8888", admin:1, email:"junhyuk@test.com", reg_date:"2025-01-10", address:"울산 남구" },

  { id:11, name:"임하늘", user_id:"haneul", user_pw:"dummy", nick:"하늘", phone:"010-8888-9999", admin:0, email:"haneul@test.com", reg_date:"2025-01-11", address:"세종시" },
  { id:12, name:"장민수", user_id:"minsu", user_pw:"dummy", nick:"민수", phone:"010-9999-0000", admin:0, email:"minsu@test.com", reg_date:"2025-01-12", address:"경기 고양시" },
  { id:13, name:"백지은", user_id:"jieun", user_pw:"dummy", nick:"지은", phone:"010-1212-3434", admin:0, email:"jieun@test.com", reg_date:"2025-01-13", address:"서울 동작구" },
  { id:14, name:"남현수", user_id:"hyunsu", user_pw:"dummy", nick:"현수", phone:"010-3434-5656", admin:0, email:"hyunsu@test.com", reg_date:"2025-01-14", address:"경기 용인시" },
  { id:15, name:"홍수진", user_id:"sujin", user_pw:"dummy", nick:"수진", phone:"010-5656-7878", admin:0, email:"sujin@test.com", reg_date:"2025-01-15", address:"서울 은평구" },

  { id:16, name:"문지훈", user_id:"moonji", user_pw:"dummy", nick:"문지", phone:"010-7878-9090", admin:0, email:"moonji@test.com", reg_date:"2025-01-16", address:"강원 춘천시" },
  { id:17, name:"신예린", user_id:"yerin", user_pw:"dummy", nick:"예린", phone:"010-9090-1111", admin:0, email:"yerin@test.com", reg_date:"2025-01-17", address:"전주 완산구" },
  { id:18, name:"강태훈", user_id:"taehoon", user_pw:"dummy", nick:"태훈", phone:"010-1111-2222", admin:0, email:"taehoon@test.com", reg_date:"2025-01-18", address:"청주 흥덕구" },
  { id:19, name:"노지민", user_id:"jimin", user_pw:"dummy", nick:"지민", phone:"010-2222-4444", admin:0, email:"jimin@test.com", reg_date:"2025-01-19", address:"포항 북구" },
  { id:20, name:"조은별", user_id:"eunbyeol", user_pw:"dummy", nick:"은별", phone:"010-3333-5555", admin:0, email:"eunbyeol@test.com", reg_date:"2025-01-20", address:"제주 제주시" },

  { id:21, name:"김상훈", user_id:"sanghoon", user_pw:"dummy", nick:"상훈", phone:"010-4444-6666", admin:0, email:"sanghoon@test.com", reg_date:"2025-01-21", address:"서울 노원구" },
  { id:22, name:"이정민", user_id:"jungmin", user_pw:"dummy", nick:"정민", phone:"010-5555-7777", admin:0, email:"jungmin@test.com", reg_date:"2025-01-22", address:"경기 파주시" },
  { id:23, name:"박서준", user_id:"seojun", user_pw:"dummy", nick:"서준", phone:"010-6666-8888", admin:0, email:"seojun@test.com", reg_date:"2025-01-23", address:"서울 용산구" },
  { id:24, name:"정하은", user_id:"haeun", user_pw:"dummy", nick:"하은", phone:"010-7777-9999", admin:0, email:"haeun@test.com", reg_date:"2025-01-24", address:"경기 안양시" },
  { id:25, name:"유승호", user_id:"seungho", user_pw:"dummy", nick:"승호", phone:"010-8888-0001", admin:1, email:"seungho@test.com", reg_date:"2025-01-25", address:"부산 연제구" },

    { id:26, name:"이상윤", user_id:"sangyoon", user_pw:"dummy", nick:"상윤", phone:"010-0001-0002", admin:0, email:"sangyoon@test.com", reg_date:"2025-01-26", address:"서울 중랑구" },
  { id:27, name:"최유리", user_id:"yuri", user_pw:"dummy", nick:"유리", phone:"010-0002-0003", admin:0, email:"yuri@test.com", reg_date:"2025-01-27", address:"경기 광주시" },
  { id:28, name:"김태현", user_id:"taehyun", user_pw:"dummy", nick:"태현", phone:"010-0003-0004", admin:0, email:"taehyun@test.com", reg_date:"2025-01-28", address:"서울 강서구" },
  { id:29, name:"박은지", user_id:"eunji", user_pw:"dummy", nick:"은지", phone:"010-0004-0005", admin:0, email:"eunji@test.com", reg_date:"2025-01-29", address:"경기 하남시" },
  { id:30, name:"정도현", user_id:"dohyun", user_pw:"dummy", nick:"도현", phone:"010-0005-0006", admin:1, email:"dohyun@test.com", reg_date:"2025-01-30", address:"서울 성북구" },

  { id:31, name:"윤소희", user_id:"sohee", user_pw:"dummy", nick:"소희", phone:"010-0006-0007", admin:0, email:"sohee@test.com", reg_date:"2025-02-01", address:"부산 수영구" },
  { id:32, name:"임재훈", user_id:"jaehoon", user_pw:"dummy", nick:"재훈", phone:"010-0007-0008", admin:0, email:"jaehoon@test.com", reg_date:"2025-02-02", address:"경기 의정부시" },
  { id:33, name:"한예진", user_id:"yejin", user_pw:"dummy", nick:"예진", phone:"010-0008-0009", admin:0, email:"yejin@test.com", reg_date:"2025-02-03", address:"서울 금천구" },
  { id:34, name:"송민석", user_id:"minseok", user_pw:"dummy", nick:"민석", phone:"010-0009-0010", admin:0, email:"minseok@test.com", reg_date:"2025-02-04", address:"경기 남양주시" },
  { id:35, name:"김하린", user_id:"harin", user_pw:"dummy", nick:"하린", phone:"010-0010-0011", admin:0, email:"harin@test.com", reg_date:"2025-02-05", address:"서울 은평구" },

  { id:36, name:"조현우", user_id:"hyunwoo2", user_pw:"dummy", nick:"현우", phone:"010-0011-0012", admin:0, email:"hyunwoo2@test.com", reg_date:"2025-02-06", address:"대구 달서구" },
  { id:37, name:"이수민", user_id:"sumin", user_pw:"dummy", nick:"수민", phone:"010-0012-0013", admin:0, email:"sumin@test.com", reg_date:"2025-02-07", address:"서울 종로구" },
  { id:38, name:"강민재", user_id:"minjae", user_pw:"dummy", nick:"민재", phone:"010-0013-0014", admin:0, email:"minjae@test.com", reg_date:"2025-02-08", address:"경기 시흥시" },
  { id:39, name:"백수아", user_id:"sua", user_pw:"dummy", nick:"수아", phone:"010-0014-0015", admin:0, email:"sua@test.com", reg_date:"2025-02-09", address:"서울 관악구" },
  { id:40, name:"장우진", user_id:"woojin", user_pw:"dummy", nick:"우진", phone:"010-0015-0016", admin:1, email:"woojin@test.com", reg_date:"2025-02-10", address:"경기 군포시" },

  { id:41, name:"문소정", user_id:"sojung", user_pw:"dummy", nick:"소정", phone:"010-0016-0017", admin:0, email:"sojung@test.com", reg_date:"2025-02-11", address:"서울 도봉구" },
  { id:42, name:"오세훈", user_id:"sehoon", user_pw:"dummy", nick:"세훈", phone:"010-0017-0018", admin:0, email:"sehoon@test.com", reg_date:"2025-02-12", address:"부산 남구" },
  { id:43, name:"김유나", user_id:"yuna", user_pw:"dummy", nick:"유나", phone:"010-0018-0019", admin:0, email:"yuna@test.com", reg_date:"2025-02-13", address:"경기 양주시" },
  { id:44, name:"서동현", user_id:"donghyun", user_pw:"dummy", nick:"동현", phone:"010-0019-0020", admin:0, email:"donghyun@test.com", reg_date:"2025-02-14", address:"서울 구로구" },
  { id:45, name:"황지민", user_id:"jimin2", user_pw:"dummy", nick:"지민", phone:"010-0020-0021", admin:0, email:"jimin2@test.com", reg_date:"2025-02-15", address:"경기 이천시" },

  { id:46, name:"정민호", user_id:"minho", user_pw:"dummy", nick:"민호", phone:"010-0021-0022", admin:0, email:"minho@test.com", reg_date:"2025-02-16", address:"서울 서대문구" },
  { id:47, name:"유가은", user_id:"gaeun", user_pw:"dummy", nick:"가은", phone:"010-0022-0023", admin:0, email:"gaeun@test.com", reg_date:"2025-02-17", address:"경기 안산시" },
  { id:48, name:"신동규", user_id:"dongkyu", user_pw:"dummy", nick:"동규", phone:"010-0023-0024", admin:0, email:"dongkyu@test.com", reg_date:"2025-02-18", address:"서울 동대문구" },
  { id:49, name:"김예림", user_id:"yerim", user_pw:"dummy", nick:"예림", phone:"010-0024-0025", admin:0, email:"yerim@test.com", reg_date:"2025-02-19", address:"경기 오산시" },
  { id:50, name:"배성우", user_id:"seongwoo", user_pw:"dummy", nick:"성우", phone:"010-0025-0026", admin:1, email:"seongwoo@test.com", reg_date:"2025-02-20", address:"서울 중구" },

  { id:51, name:"안지훈", user_id:"jihoon2", user_pw:"dummy", nick:"지훈", phone:"010-0026-0027", admin:0, email:"jihoon2@test.com", reg_date:"2025-02-21", address:"경기 김포시" },
  { id:52, name:"차유진", user_id:"yujin2", user_pw:"dummy", nick:"유진", phone:"010-0027-0028", admin:0, email:"yujin2@test.com", reg_date:"2025-02-22", address:"서울 양천구" },
  { id:53, name:"권도영", user_id:"doyoung", user_pw:"dummy", nick:"도영", phone:"010-0028-0029", admin:0, email:"doyoung@test.com", reg_date:"2025-02-23", address:"경기 화성시" },
  { id:54, name:"이하은", user_id:"haeun2", user_pw:"dummy", nick:"하은", phone:"010-0029-0030", admin:0, email:"haeun2@test.com", reg_date:"2025-02-24", address:"서울 강북구" },
  { id:55, name:"조성민", user_id:"seongmin", user_pw:"dummy", nick:"성민", phone:"010-0030-0031", admin:0, email:"seongmin@test.com", reg_date:"2025-02-25", address:"경기 평택시" },

  { id:56, name:"윤하람", user_id:"haram", user_pw:"dummy", nick:"하람", phone:"010-0031-0032", admin:0, email:"haram@test.com", reg_date:"2025-02-26", address:"서울 노원구" },
  { id:57, name:"임수현", user_id:"soohyun", user_pw:"dummy", nick:"수현", phone:"010-0032-0033", admin:0, email:"soohyun@test.com", reg_date:"2025-02-27", address:"경기 구리시" },
  { id:58, name:"김나연", user_id:"nayeon", user_pw:"dummy", nick:"나연", phone:"010-0033-0034", admin:0, email:"nayeon@test.com", reg_date:"2025-02-28", address:"서울 서초구" },
  { id:59, name:"백승민", user_id:"seungmin", user_pw:"dummy", nick:"승민", phone:"010-0034-0035", admin:0, email:"seungmin@test.com", reg_date:"2025-03-01", address:"경기 포천시" },
  { id:60, name:"정소라", user_id:"sora", user_pw:"dummy", nick:"소라", phone:"010-0035-0036", admin:1, email:"sora@test.com", reg_date:"2025-03-02", address:"서울 송파구" },

  { id:61, name:"오준서", user_id:"junseo", user_pw:"dummy", nick:"준서", phone:"010-0036-0037", admin:0, email:"junseo@test.com", reg_date:"2025-03-03", address:"경기 의왕시" },
  { id:62, name:"김다인", user_id:"dain", user_pw:"dummy", nick:"다인", phone:"010-0037-0038", admin:0, email:"dain@test.com", reg_date:"2025-03-04", address:"서울 성동구" },
  { id:63, name:"서지훈", user_id:"jihoon3", user_pw:"dummy", nick:"지훈", phone:"010-0038-0039", admin:0, email:"jihoon3@test.com", reg_date:"2025-03-05", address:"경기 부천시" },
  { id:64, name:"민예원", user_id:"yewon", user_pw:"dummy", nick:"예원", phone:"010-0039-0040", admin:0, email:"yewon@test.com", reg_date:"2025-03-06", address:"서울 강동구" },
  { id:65, name:"김도훈", user_id:"dohoon", user_pw:"dummy", nick:"도훈", phone:"010-0040-0041", admin:0, email:"dohoon@test.com", reg_date:"2025-03-07", address:"경기 광명시" },

  { id:66, name:"유민재", user_id:"minjae2", user_pw:"dummy", nick:"민재", phone:"010-0041-0042", admin:0, email:"minjae2@test.com", reg_date:"2025-03-08", address:"서울 영등포구" },
  { id:67, name:"차서연", user_id:"seoyeon2", user_pw:"dummy", nick:"서연", phone:"010-0042-0043", admin:0, email:"seoyeon2@test.com", reg_date:"2025-03-09", address:"경기 동두천시" },
  { id:68, name:"김현수", user_id:"hyunsu2", user_pw:"dummy", nick:"현수", phone:"010-0043-0044", admin:0, email:"hyunsu2@test.com", reg_date:"2025-03-10", address:"서울 마포구" },
  { id:69, name:"이채원", user_id:"chaewon", user_pw:"dummy", nick:"채원", phone:"010-0044-0045", admin:0, email:"chaewon@test.com", reg_date:"2025-03-11", address:"경기 양평군" },
  { id:70, name:"장현우", user_id:"hyunwoo3", user_pw:"dummy", nick:"현우", phone:"010-0045-0046", admin:1, email:"hyunwoo3@test.com", reg_date:"2025-03-12", address:"서울 강남구" },

  { id:71, name:"정다영", user_id:"dayoung", user_pw:"dummy", nick:"다영", phone:"010-0046-0047", admin:0, email:"dayoung@test.com", reg_date:"2025-03-13", address:"경기 시흥시" },
  { id:72, name:"송준호", user_id:"junho2", user_pw:"dummy", nick:"준호", phone:"010-0047-0048", admin:0, email:"junho2@test.com", reg_date:"2025-03-14", address:"서울 중랑구" },
  { id:73, name:"김시은", user_id:"sieun", user_pw:"dummy", nick:"시은", phone:"010-0048-0049", admin:0, email:"sieun@test.com", reg_date:"2025-03-15", address:"경기 안성시" },
  { id:74, name:"이민규", user_id:"mingyu", user_pw:"dummy", nick:"민규", phone:"010-0049-0050", admin:0, email:"mingyu@test.com", reg_date:"2025-03-16", address:"서울 강북구" },
  { id:75, name:"박다솜", user_id:"dasom", user_pw:"dummy", nick:"다솜", phone:"010-0050-0051", admin:0, email:"dasom@test.com", reg_date:"2025-03-17", address:"경기 여주시" },

  { id:76, name:"유태경", user_id:"taekyung", user_pw:"dummy", nick:"태경", phone:"010-0051-0052", admin:0, email:"taekyung@test.com", reg_date:"2025-03-18", address:"서울 서초구" },
  { id:77, name:"김보라", user_id:"bora", user_pw:"dummy", nick:"보라", phone:"010-0052-0053", admin:0, email:"bora@test.com", reg_date:"2025-03-19", address:"경기 의정부시" },
  { id:78, name:"정은찬", user_id:"eunchan", user_pw:"dummy", nick:"은찬", phone:"010-0053-0054", admin:0, email:"eunchan@test.com", reg_date:"2025-03-20", address:"서울 강서구" },
  { id:79, name:"최수빈", user_id:"soobin", user_pw:"dummy", nick:"수빈", phone:"010-0054-0055", admin:0, email:"soobin@test.com", reg_date:"2025-03-21", address:"경기 양주시" },
  { id:80, name:"강준혁", user_id:"junhyuk2", user_pw:"dummy", nick:"준혁", phone:"010-0055-0056", admin:1, email:"junhyuk2@test.com", reg_date:"2025-03-22", address:"서울 송파구" },

  { id:81, name:"문하준", user_id:"hajun", user_pw:"dummy", nick:"하준", phone:"010-0056-0057", admin:0, email:"hajun@test.com", reg_date:"2025-03-23", address:"경기 파주시" },
  { id:82, name:"윤예지", user_id:"yezi", user_pw:"dummy", nick:"예지", phone:"010-0057-0058", admin:0, email:"yezi@test.com", reg_date:"2025-03-24", address:"서울 광진구" },
  { id:83, name:"김태윤", user_id:"taeyoon", user_pw:"dummy", nick:"태윤", phone:"010-0058-0059", admin:0, email:"taeyoon@test.com", reg_date:"2025-03-25", address:"경기 동두천시" },
  { id:84, name:"서혜린", user_id:"hyelin", user_pw:"dummy", nick:"혜린", phone:"010-0059-0060", admin:0, email:"hyelin@test.com", reg_date:"2025-03-26", address:"서울 노원구" },
  { id:85, name:"오민성", user_id:"minseong", user_pw:"dummy", nick:"민성", phone:"010-0060-0061", admin:0, email:"minseong@test.com", reg_date:"2025-03-27", address:"경기 평택시" },

  { id:86, name:"장예은", user_id:"yeeun", user_pw:"dummy", nick:"예은", phone:"010-0061-0062", admin:0, email:"yeeun@test.com", reg_date:"2025-03-28", address:"서울 강동구" },
  { id:87, name:"김우성", user_id:"woosung", user_pw:"dummy", nick:"우성", phone:"010-0062-0063", admin:0, email:"woosung@test.com", reg_date:"2025-03-29", address:"경기 광주시" },
  { id:88, name:"이주은", user_id:"jueun", user_pw:"dummy", nick:"주은", phone:"010-0063-0064", admin:0, email:"jueun@test.com", reg_date:"2025-03-30", address:"서울 마포구" },
  { id:89, name:"한승현", user_id:"seunghyun", user_pw:"dummy", nick:"승현", phone:"010-0064-0065", admin:0, email:"seunghyun@test.com", reg_date:"2025-03-31", address:"경기 김포시" },
  { id:90, name:"정유림", user_id:"yurim", user_pw:"dummy", nick:"유림", phone:"010-0065-0066", admin:1, email:"yurim@test.com", reg_date:"2025-04-01", address:"서울 성동구" },

  { id:91, name:"김세훈", user_id:"sehoon2", user_pw:"dummy", nick:"세훈", phone:"010-0066-0067", admin:0, email:"sehoon2@test.com", reg_date:"2025-04-02", address:"경기 남양주시" },
  { id:92, name:"윤지후", user_id:"jihoo", user_pw:"dummy", nick:"지후", phone:"010-0067-0068", admin:0, email:"jihoo@test.com", reg_date:"2025-04-03", address:"서울 관악구" },
  { id:93, name:"박현아", user_id:"hyuna", user_pw:"dummy", nick:"현아", phone:"010-0068-0069", admin:0, email:"hyuna@test.com", reg_date:"2025-04-04", address:"경기 안산시" },
  { id:94, name:"이도경", user_id:"dokyung", user_pw:"dummy", nick:"도경", phone:"010-0069-0070", admin:0, email:"dokyung@test.com", reg_date:"2025-04-05", address:"서울 서대문구" },
  { id:95, name:"최은솔", user_id:"eunsol", user_pw:"dummy", nick:"은솔", phone:"010-0070-0071", admin:0, email:"eunsol@test.com", reg_date:"2025-04-06", address:"경기 군포시" },

  { id:96, name:"강하준", user_id:"hajun2", user_pw:"dummy", nick:"하준", phone:"010-0071-0072", admin:0, email:"hajun2@test.com", reg_date:"2025-04-07", address:"서울 동작구" },
  { id:97, name:"김아린", user_id:"arin", user_pw:"dummy", nick:"아린", phone:"010-0072-0073", admin:0, email:"arin@test.com", reg_date:"2025-04-08", address:"경기 오산시" },
  { id:98, name:"정민재", user_id:"minjae3", user_pw:"dummy", nick:"민재", phone:"010-0073-0074", admin:0, email:"minjae3@test.com", reg_date:"2025-04-09", address:"서울 용산구" },
  { id:99, name:"유서진", user_id:"seojin", user_pw:"dummy", nick:"서진", phone:"010-0074-0075", admin:0, email:"seojin@test.com", reg_date:"2025-04-10", address:"경기 파주시" },
  { id:100, name:"홍채원", user_id:"chaewon2", user_pw:"dummy", nick:"채원", phone:"010-0075-0076", admin:1, email:"chaewon2@test.com", reg_date:"2025-04-11", address:"서울 강남구" },

];

export default usersdb;
