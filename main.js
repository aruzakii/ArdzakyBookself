const buku =[];
const render_event ='render-buku'


document.addEventListener('DOMContentLoaded',function(){
    const submitform = document.getElementById('inputbuku')

    submitform.addEventListener('submit',function(event){
        event.preventDefault()
        tambah_buku()
    })

    if(apakahstorageada()){
        loaddatadaristorage()
    }
})




function tambah_buku(){
    const generate_id = buatid()
    const text_judulbuku =document.getElementById('inputBookTitle').value
    const text_penulis = document.getElementById('inputBookAuthor').value
    const tahun=document.getElementById('inputBookYear').value
    const check = document.getElementById('inputBookIsComplete').checked


    const objek_tambahbuku = generate_objektambahbuku(generate_id,text_judulbuku,text_penulis,tahun,check)
    buku.push(objek_tambahbuku)

    document.dispatchEvent(new Event(render_event));
    savedata()

}

function buatid(){
    return +new Date();
}

function generate_objektambahbuku(id,judul,penulis,tahun,sudahdibaca){
    return{
        id,
        judul,
        penulis,
        tahun,
        sudahdibaca
    }
}

function buat_buku(objekbuku){
    const textjudul = document.createElement('h3')
    textjudul.innerText = 'JUDUL :'+ " " + objekbuku.judul

    const textpenulis = document.createElement('p')
    textpenulis.innerText='PENULIS :'+" "+objekbuku.penulis

    const texttahun = document.createElement('p')
    texttahun.innerText ='TAHUN :'+" "+objekbuku.tahun

    const artikel =document.createElement('article')
    artikel.classList.add('book_item')

    artikel.append(textjudul,textpenulis,texttahun)

    artikel.setAttribute('id','objekbuku.id')

    if(objekbuku.sudahdibaca){
        const sudahdibaca_tombol =document.createElement('button')
        sudahdibaca_tombol.innerText='Belum selesai di Baca'
        sudahdibaca_tombol.classList.add('green')

        sudahdibaca_tombol.addEventListener('click',function(){
            ubahkebelumdibaca(objekbuku.id)
        })

        const hapus_tombol = document.createElement('button')
        hapus_tombol.innerText='Hapus buku'
        hapus_tombol.classList.add('red')

        hapus_tombol.addEventListener('click',function(){
            hapusbuku(objekbuku.id)
        })

        const box = document.createElement('div')
        box.classList.add('action')
        box.append(sudahdibaca_tombol,hapus_tombol)
        artikel.append(box)


    }
    else{
        const belumdibaca_tombol = document.createElement('button')
        belumdibaca_tombol.innerText='Selesai dibaca'
        belumdibaca_tombol.classList.add('green')

        belumdibaca_tombol.addEventListener('click',function(){
            ubahsudahdibaca(objekbuku.id)
        })
        const hapus_tombol = document.createElement('button')
        hapus_tombol.innerText='Hapus buku'
        hapus_tombol.classList.add('red')

        hapus_tombol.addEventListener('click',function(){
            hapusbuku(objekbuku.id)
        })
        const box = document.createElement('div')
        box.classList.add('action')
        box.append(belumdibaca_tombol,hapus_tombol)
        artikel.append(box)
    }

    return artikel

}

function hapusbuku(idbuku){
    const targetrak = cariindexbuku(idbuku)

    if (targetrak === -1 ) return;

    buku.splice(targetrak,1)
    document.dispatchEvent(new Event(render_event))
    savedata()
}

function cariindexbuku(idbuku){
    for (const index in buku){
        if (buku[index].id === idbuku){
            return index
        }
    }

    return -1

}


function ubahkebelumdibaca(idbuku){
    const targetrak = carirak(idbuku)

    if (targetrak == null)return;
    targetrak.sudahdibaca = false

    document.dispatchEvent(new Event(render_event))
    savedata()
}


function ubahsudahdibaca(idbuku){
    const targetrak = carirak(idbuku)

    if(targetrak == null) return;

    targetrak.sudahdibaca =true;
    document.dispatchEvent(new Event(render_event));
    savedata()
}

function carirak(idbuku){
    for (const itembuku of buku){
        if(itembuku.id === idbuku){
            return itembuku
        }
    }
    return null

}

document.addEventListener(render_event,function(){
    const daftarbukuyangbelumdibaca = document.getElementById('incompleteBookshelfList')
    daftarbukuyangbelumdibaca.innerHTML =''

    const daftarbukuyangsudahdibaca = document.getElementById('completeBookshelfList')
    daftarbukuyangsudahdibaca.innerHTML=''


    for (const itembuku of buku){
        const elemenbuku = buat_buku(itembuku)
        if(!itembuku.sudahdibaca){
        daftarbukuyangbelumdibaca.append(elemenbuku)}
        else{
            daftarbukuyangsudahdibaca.append(elemenbuku)
        }
    }
})


//localstorage

function savedata(){
    if(apakahstorageada()){
        const parsed = JSON.stringify(buku)
        localStorage.setItem(storage_key,parsed)
        document.dispatchEvent(new Event(saved_event))
    }
}

const saved_event ='save=buku'
const storage_key = 'buku-apps'

function apakahstorageada(){
    if(typeof(Storage)=== undefined){
        alert('Browser Tidak Mendukung Local Storage')
        return false
    }
    return true
}

function loaddatadaristorage(){
    const serializdata = localStorage.getItem(storage_key)
    let data = JSON.parse(serializdata)

    if(data !== null){
        for(const bukku of data){
            buku.push(bukku)
        }
    }
    document.dispatchEvent(new Event(render_event));
}

document.addEventListener(saved_event,function(){
    console.log(localStorage.getItem(storage_key))
})


