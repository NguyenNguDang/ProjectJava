document.addEventListener("DOMContentLoaded",()=>{
    const menuLi = document.querySelectorAll(".sidebar-content > ul > li > a")
    const subMenu = document.querySelectorAll('.sub-menu')

    for(let i = 0; i < menuLi.length;i++){
        menuLi[i].addEventListener('click',(e)=>{
            // ngăn event thẻ a 
            e.preventDefault()
            // muốn lấy thằng cha của thẻ nào đó thì .parentNode 
            // muốn từ thằng cha đi vào con thì .querySelector('')
            //nghiên cứu parentElement
            // menuLi[i].parentNode.querySelector('ul').classList.toggle('active')

            for(let j = 0; j <subMenu.length;j++){
                subMenu[j].setAttribute('style','height: 0px')
            }
            const submenuHeight = menuLi[i].parentNode.querySelector('ul .sub-menu-items').offsetHeight
            menuLi[i].parentNode.querySelector('ul').setAttribute('style','height:'+submenuHeight+'px')
        })
    }



},false)