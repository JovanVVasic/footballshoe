window.onload = function(){
    
    
    let navBar = ["Home","Shop", "Contact", "Author"];
    let navPages = ["index.html","shop.html", "contact.html", "https://jovanvvasic.github.io/portfolio/"];

    /* navbar ispis */
    function ispisNavBar(niz1, niz2){
        let html='';
        html+='<ul>';
        for(let i=0;i<niz1.length; i++){
            html+=`<li><a href="${niz1[i]}">${niz2[i]}</a></li>`;
        }
        html+='</ul>';
        $('.nav-bar').html(html);
    };
ispisNavBar(navPages,navBar);

let brendovi = [];

var url = window.location.pathname;
    url = url.substring(url.lastIndexOf('/'));
if (url == "/" || url == "/index.html"){
    pokupiPodatke('brands.json',ispisiBrendove);
    let proveraKorpe = procitajKorpu('korpa');
    if(proveraKorpe==null || proveraKorpe.length==0){
        document.getElementById('cart').style.visibility = 'hidden';
    }
    else{
        document.getElementById('broj-porudzbina').style.visibility = 'visible';
        $('#broj-porudzbina').html(proveraKorpe.length);
    }
}
if(url=='/shop.html'){
    document.getElementById('sort').addEventListener('change',filterChange);
    $(".price").change(filterChange);
    document.getElementById('search').addEventListener("keyup", filterChange);
    pokupiPodatke('brands.json',brendoviCbIspis);
    pokupiPodatke('products.json',ispisProducts);
    pokupiPodatke('products.json', function(data){
        dodavanjeULocalStorage('products', data)
    });

    let proveraKorpe = procitajKorpu('korpa');
    if(proveraKorpe==null || proveraKorpe.length==0){
        document.getElementById('broj-porudzbina').style.visibility = 'hidden';
    }
    else{
        document.getElementById('broj-porudzbina').style.visibility = 'visible';
        $('#broj-porudzbina').html(proveraKorpe.length);
    }
}
if(url=='/contact.html'){
    document.getElementById("submit-button").addEventListener('click',buttonClick);
    let proveraKorpe = procitajKorpu('korpa');
    if(proveraKorpe==null || proveraKorpe.length==0){
        document.getElementById('cart').style.visibility = 'hidden';
    }
    else{
        document.getElementById('broj-porudzbina').style.visibility = 'visible';
        $('#broj-porudzbina').html(proveraKorpe.length);
    }
}
if(url=='/cart.html'){
    ispisiCart();
}

/* ajax funkcija */
function pokupiPodatke(file, funkcija) {
    $.ajax({
      url: "assets/data/" + file,
      method: "get",
      datatype: "json",
      success: function (data) {
        funkcija(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
}









    /* banner ispis */
  function ispisiBrendove(niz){
      let html = '';
      //console.log(niz.length)
      for(let i=0;i<2;i++){
          if(i%2==0){
              html+=`<div class="marks-div black">
              <div class="container">
                  <div class="marks-levo">
                      <img src="./assets/img/${niz[i].picture}" alt="${niz[i].name}" width="600px" height="400px"/>
                  </div>
                  <div class="marks-desno belo">
                      <h4 class="marks-h">${niz[i].name}</h4>
                      <p class="moto">${niz[i].moto}</p>
                      <div class="description-text">
                          <p>${niz[i].description}</p>
                          <div class="marks-buy-now"><a href="./shop.html">Buy now</a></div>
                      </div>
                  </div>
              </div>
          </div>`
          }
          else{
              html+=`<div class="marks-div">
              <div class="container">
                  <div class="marks-levo">
                      <h4 class="marks-h">${niz[i].name}</h4>
                      <p class="moto">${niz[i].moto}</p>
                      <div class="description-text">
                          <p>${niz[i].description}</p>
                          <div class="marks-buy-now"><a href="./shop.html">Buy now</a></div>
                      </div>
                  </div>
                  <div class="marks-desno">
                      <img src="./assets/img/${niz[i].picture}" alt="${niz[i].name}" width="600px" height="400px"/>
                  </div>
              </div>
          </div>`
            }
        }
        $("#marks").html(html);
        brendovi=niz;
    }

    
    /* cb ispis */
    function brendoviCbIspis(nizBrendovi){
        let html='';
        html+='<ul>';
        //console.log(nizBrendovi.length)
        for(let i=0; i<nizBrendovi.length; i++){
            html+=`<li><input type="checkbox" value="${nizBrendovi[i].id}" name="brendovi" class="brendovi"/>${nizBrendovi[i].name} </li>`;
        }
        html+='</ul>';

        $('#brends-form').html(html);
        //console.log(brendovi)

        $(".brendovi").change(filterChange);
    };
    
    



    /* products ispis */
    function ispisProducts(niz){
        niz = filtriranjeBrendova(niz);
        niz = filtriranjePrice(niz)
        niz = sortOdDo(niz);
        niz = pretragaPoTextu(niz);

        let html='';
        if(niz.length>0){
            for(let i=0; i<niz.length;i++){
                html+=`<div class="artikl">
                            <div class="artikl-picture">
                                <img src="./assets/img/${niz[i].image.src}" alt="${niz[i].image.alt}" class="artikl-slika"/>
                            </div>
                            <h5>${niz[i].name}</h5>
                            <p class="artikl-text">${niz[i].price.newPrice} €</p>
                            <s class="artikl-text">${niz[i].price.oldPrice} €</s>
                            <div class="add-to-chart">
                            <input type="button" data-id=${niz[i].id} value="Add to Cart" class="dodaj" />
                            </div>
                        </div>`
            }
        }
        else{
            html+=`<div class="prazno-artikli">
                    <p>No items match!</p>
                </div>`;
        }
        $('#main-desno').html(html);

        $('.dodaj').click(dodajUKorpu);
    };
    

    
    
    
    /* sortiranje od-do */
    function sortOdDo(niz){
        let tipSortiranja = document.getElementById('sort').value;
        if(tipSortiranja=='asc'){
            return niz.sort((el1,el2)=>{
                if(el1.price.newPrice < el2.price.newPrice){
                    return -1;
                }
                else if(el1.price.newPrice > el2.price.newPrice){
                    return 1;
                }
                else{
                    return 0;
                }
            });
        }
        else if(tipSortiranja=='desc'){
            return niz.sort((el1,el2)=>{
                if(el1.price.newPrice < el2.price.newPrice){
                    return 1;
                }
                else if(el1.price.newPrice > el2.price.newPrice){
                    return -1;
                }
                else{
                    return 0;
                }
            });
        }
        else if(tipSortiranja=='name'){
            return niz.sort((el1,el2)=>{
                if(el1.name < el2.name){
                    return -1;
                }
                else if(el1.name > el2.name){
                    return 1;
                }
                else{
                    return 0;
                }
            });
        }
        else{
            return niz;
        }
    };



    /* filtriranje brands */
    function filtriranjeBrendova(niz){
        let nizSelektovanih = [];
        for(let i=0; i<$(".brendovi:checked").length; i++){
            nizSelektovanih.push(parseInt($(".brendovi:checked")[i].value));
        }
        if(nizSelektovanih != 0){
            return niz.filter((x)=> nizSelektovanih.includes(x.brandId));
        }
        else return niz;
    }




    /* filtriranje price */
    function filtriranjePrice(niz){
        let nizSelektovanih = [];
        for(let i=0; i<$(".price:checked").length; i++){
            nizSelektovanih.push(parseInt($(".price:checked")[i].value));
        }
        if(nizSelektovanih.length>0){
            let nizIspis = [];
            for(let i=0; i<nizSelektovanih.length;i++){
                if(nizSelektovanih[i]=='100'){
                    for(let y=0; y<niz.length; y++){
                        if(niz[y].price.newPrice>99 && niz[y].price.newPrice<151){
                            nizIspis.push(niz[y]);
                        }
                    }
                }
                if(nizSelektovanih[i]=='150'){
                    for(let y=0; y<niz.length; y++){
                        if(niz[y].price.newPrice>150 && niz[y].price.newPrice<201){
                            nizIspis.push(niz[y]);
                        }
                    }
                }
                if(nizSelektovanih[i]=='200'){
                    for(let y=0; y<niz.length; y++){
                        if(niz[y].price.newPrice>200){
                            nizIspis.push(niz[y]);
                        }
                    }
                }
            }
            return nizIspis;
        }
        else return niz;
        
    }

    /* pretraga tekst */
    function pretragaPoTextu(niz){
        let unosKorisnika = document.getElementById('search').value;
        
        return niz.filter(function (el){
            if (el.name.toUpperCase().indexOf(unosKorisnika.trim().toUpperCase()) != -1){
                return el;
            }
        });
    
    }


    function filterChange(){
        pokupiPodatke('products.json',ispisProducts);
    }

    
    /* regex provera */
    let reName = /^[A-ZČĆŠĐŽ][a-zčćšđž]{2,15}$/;
    let reLastName = /^([A-ZČĆŠĐŽ][a-zčćšđž]{2,15})(\s[A-ZČĆŠĐŽ][a-zčćšđž]{2,15})?$/;
    let reEmail = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
    let reNumber = /^[+][0-9]{9,12}$/;

    
    function buttonClick(){
        let name = document.getElementById('ime').value;
        let lastName = document.getElementById('prezime').value;
        let email = document.getElementById('email').value;
        let telefon = document.getElementById('telefon').value;
        let textarea = document.getElementById('message').value;
        let greske = [];

        if(!reName.test(name)){
            if(name==''){
                document.getElementById('ime').setAttribute('placeholder', "Name can't be empty...");
                document.getElementById('ime').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            else{
                document.getElementById('ime').setAttribute('placeholder', "Wrong name entry...");
                document.getElementById('ime').value = '';
                document.getElementById('ime').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            greske.push("ime");
        }
        else{
            document.getElementById('ime').style.backgroundColor = 'white';
        }

        if(!reLastName.test(lastName)){
            if(lastName==''){
                document.getElementById('prezime').setAttribute('placeholder', "Last name can't be empty...");
                document.getElementById('prezime').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            else{
                document.getElementById('prezime').setAttribute('placeholder', "Wrong last name entry...");
                document.getElementById('prezime').value = '';
                document.getElementById('prezime').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            greske.push("prezime");
        }
        else{
            document.getElementById('prezime').style.backgroundColor = 'white';
        }

        if(!reEmail.test(email)){
            if(email==''){
                document.getElementById('email').setAttribute('placeholder', "Email can't be empty...");
                document.getElementById('email').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            else{
                document.getElementById('email').setAttribute('placeholder', "Wrong email entry...");
                document.getElementById('email').value = '';
                document.getElementById('email').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            greske.push("email");
        }
        else{
            document.getElementById('email').style.backgroundColor = 'white';
        }

        if(!reNumber.test(telefon)){
            if(telefon==''){
                document.getElementById('telefon').setAttribute('placeholder', "Phone number can't be empty...");
                document.getElementById('telefon').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            else{
                document.getElementById('telefon').setAttribute('placeholder', "Wrong phone number entry...");
                document.getElementById('telefon').value = '';
                document.getElementById('telefon').style.backgroundColor = '#c9b3b5';
                document.getElementById('message-sent').style.visibility = 'hidden';
            }
            greske.push("telefon");
        }
        else{
            document.getElementById('telefon').style.backgroundColor = 'white';
        }

        if(textarea == ''){
            document.getElementById('message').setAttribute('placeholder', "Message can't be empty...");
            document.getElementById('message').style.backgroundColor = '#c9b3b5';
            document.getElementById('message-sent').style.visibility = 'hidden';
            greske.push("message");
        }
        else{
            document.getElementById('message').style.backgroundColor = 'white';
        }


        if(greske.length==0){
            document.getElementById('message-sent').style.visibility = 'visible';
        }
    }
    



    /* korpa */

    function dodavanjeULocalStorage(ime, data){
        localStorage.setItem(ime, JSON.stringify(data));
    };
    function procitajKorpu(ime){
        return JSON.parse(localStorage.getItem(ime));
    }
    
    function dodajUKorpu(){
        let dataId = $(this).data('id');
        //console.log(dataId);
        let proveraKorpe = procitajKorpu('korpa');
        

        if(proveraKorpe){
            //console.log('Ima u korpi');
            document.getElementById('broj-porudzbina').style.visibility = 'visible';
            $('#broj-porudzbina').html(proveraKorpe.length);

            if(proveraKorpe.filter(k => k.id == dataId).length){
                //console.log('dodaj kolicinu');
                for(let i=0; i<proveraKorpe.length; i++){
                    if(proveraKorpe[i].id==dataId){
                        proveraKorpe[i].kolicina++;
                        break;
                    }
                }
                dodavanjeULocalStorage('korpa',proveraKorpe);
            }
            else{
                //console.log('dodaj novi u korpu');
                proveraKorpe.push({
                    id:dataId,
                    kolicina: 1
                });
                dodavanjeULocalStorage('korpa',proveraKorpe);
                document.getElementById('broj-porudzbina').style.visibility = 'visible';
                $('#broj-porudzbina').html(proveraKorpe.length);
            }

        }
        else{
            //console.log('Nema u korpi');
            let prozivodiUKorpi = [];
            prozivodiUKorpi[0]= {
                id: dataId,
                kolicina: 1
            }
            dodavanjeULocalStorage('korpa',prozivodiUKorpi);
            document.getElementById('broj-porudzbina').style.visibility = 'visible';
            $('#broj-porudzbina').html(prozivodiUKorpi.length);
        }

        
    };


    function ispisiCart(){
        let produkti = procitajKorpu('korpa');
        let sviProdukti = procitajKorpu('products');

        //console.log(produkti);
        //console.log(sviProdukti);

        let produktiNoviNiz = [];

        if(produkti==null || produkti==0){
            let html = `<div class="container">
            <div class="nothing-selected">
                <p>Nothing selected in the Cart yet!</p>
            </div>
        </div>`;
        $('#main-korpa').html(html);
        }
        else{
            sviProdukti.filter(sp=> {
                for(let p of produkti){
                    if(sp.id == p.id){
                        sp.kolicina = p.kolicina;
                        return produktiNoviNiz.push(sp);
                    }
                }
            });
            pojedinacniProdukti(produktiNoviNiz);
            $('.product-remove').click(izbrisiProizvod);
            $("#remove-all").click(izbrisiSveProizvodeIzKorpe);
            $("#purchase").click(purchase);
            $(".add-one-more").click(addOneMore);
            $(".down-quantity").click(quantityDown);
        }
        //console.log(produktiNoviNiz);
        if(produkti==0 || produkti==null){
        localStorage.removeItem('korpa');
        }
    };

    function pojedinacniProdukti(niz){
        let html = '';
        let totalPrice = 0;
        html+='<div class="container">';


        html+=`<div class="drzac-korpa border-dole">
                <div class="korpa-blok">
                    <p>Product</p>
                </div>
                <div class="korpa-blok">
                    <p>Product name</p>
                </div>
                <div class="korpa-blok">
                    <p>Price</p>
                </div>
                <div class="korpa-blok">
                    <p>Quantity</p>
                </div>
                <div class="korpa-blok">
                    <p>Sum</p>
                </div>
            </div>`;



        for(let n of niz){
            html += ` <div class="drzac-korpa">
                        <div class="korpa-blok">
                            <img src="./assets/img/${n.image.src}" alt="${n.image.alt}"/>
                        </div>
                        <div class="korpa-blok">
                            <p>${n.name}</p>
                        </div>
                        <div class="korpa-blok">
                            <p>${n.price.newPrice}€</p>
                        </div>
                        <div class="korpa-blok">
                            <p>${n.kolicina}</p>
                        </div>
                        <div class="korpa-blok">
                            <p>${n.kolicina * n.price.newPrice}€</p>
                        </div>
                    </div>
                    <div class="add-remove">
                        <div class="add-quantity">
                            <input type="button" value="Add One More" class="add-one-more" data-id="${n.id}"/>
                        </div>
                        <div class="quantity-down">
                            <input type="button" value="Quantity Down" class="down-quantity" data-id="${n.id}"/>
                        </div>
                        <div class="remove-product">
                            <input type="button" value="Remove Product" class="product-remove" data-id="${n.id}"/>
                        </div>
                    </div>`;
                    totalPrice += n.kolicina * n.price.newPrice;
        }


        html+=`<div id="sum-all">
                <div id="price-summary">
                    <p>Total price: ${totalPrice}€</p>
                </div>
                <div id="purchase-div">
                    <input type="button" value="Pruchase" id="purchase"/>
                </div>
                <div id="remove-all-div">
                    <input type="button" value="Remove All" id="remove-all"/>
                </div>
            </div>`;

        html+='</div>';


        $('#main-korpa').html(html);
    };

    function izbrisiProizvod(){
        let dataId = $(this).data('id');
        console.log(dataId);
        
        let produkti = procitajKorpu('korpa');
        let izbrisani = produkti.filter(p => p.id != dataId);
        console.log(izbrisani);
        
        dodavanjeULocalStorage('korpa',izbrisani);
        ispisiCart();
    }

    function izbrisiSveProizvodeIzKorpe(){
        localStorage.removeItem('korpa');
        ispisiCart();
    }

    function purchase(){
        let produkti = procitajKorpu('korpa');
        let sviProdukti = procitajKorpu('products')
        let greske = [];
        for(let p of produkti){
            if(p.kolicina>5){
                alert("Can't order more than 5 same products.");
                p.kolicina = 5;
                dodavanjeULocalStorage('korpa',produkti);
                greske.push('greska');
                ispisiCart();
            }
        }
        //console.log(greske.length)
        if(greske.length>0){
            ispisiCart();
        }
        else{
            let products = procitajKorpu('korpa');
            let allProducts = procitajKorpu('products')
            let greske = [];
            for(let i=0; i<products.length; i++){
                for(let y=0; y<allProducts.length; y++){
                    if(products[i].id==allProducts[y].id){
                        let velicina = prompt("Enter the size of " +allProducts[y].name+ ":"); 
                        console.log(velicina);
                        if(velicina<39 || velicina>48){
                            greske.push(products[i].id)
                        }
                    }
                }
            }
            console.log(greske);
            if(greske.length>0){
                for(let i=0; i<sviProdukti.length; i++){
                    for(let y=0; y<greske.length; y++){
                        if(sviProdukti[i].id==greske[y]){
                            prompt("Size of "+sviProdukti[i].name+" have to be between 39 and 48. Please enter the rigth size:");
                        }
                    }
                }
            localStorage.removeItem('korpa');
            ispisiCart();
            alert("You ordered successfully");
            }
            else{
            localStorage.removeItem('korpa');
            ispisiCart();
            //console.log("nema greske");
            
            
            alert("You ordered successfully");
            }
        }
    
    }

    function addOneMore(){
        let dataId = $(this).data('id');
        let produkti =procitajKorpu('korpa');
        for(let i=0; i<produkti.length; i++){
            if(produkti[i].id == dataId){
                produkti[i].kolicina++;
                if(produkti[i].kolicina>=6){
                    alert("Can't order more than 5 same products.");
                    produkti[i].kolicina = 5;
                }
            }
        }
        dodavanjeULocalStorage('korpa',produkti);
        ispisiCart();
    }

    function quantityDown(){
        let dataId = $(this).data('id');
        let produkti =procitajKorpu('korpa');
        for(let i=0; i<produkti.length; i++){
            if(produkti[i].id == dataId){
                produkti[i].kolicina--;
                if(produkti[i].kolicina==0){
                    produkti[i].kolicina++;
                }
            }
        }
        dodavanjeULocalStorage('korpa',produkti);
        ispisiCart();
    }
};