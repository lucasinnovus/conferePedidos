document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.querySelector("label[for='files[]']");
    const fileInput = document.getElementById("files[]");
    const response = document.getElementById('response');
    const form = document.getElementById('upload-form');
    const btn = document.getElementById('buttonform');
    const box = document.getElementById('drop-area');
    const fileList = document.getElementById("file-list");

    function toggleLoader(){
        const loader = document.getElementById("loading");
        loader.classList.toggle("hidden");
    }

    form.addEventListener('submit', function(e){
        e.preventDefault();
        toggleLoader();
        btn.classList.toggle("hidden");
        fileList.classList.toggle("hidden");
        box.classList.remove('items-center');
        box.classList.add('items-end');
        box.classList.toggle("hidden");
        let formData = new FormData(form);
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("files[]", fileInput.files[i]);
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "uploadPlanilhas.php", true);

        xhr.onload = function(){
            if(xhr.status === 200){
                const resposta = xhr.responseText;
                const pedidos = JSON.parse(resposta);
                const litrosTotais = pedidos.pop();
                response.classList.toggle("hidden");
                response.innerHTML += `
                <p id="areaCopiar">${pedidos}</p>
                <span class="text-green-600 font-bold">Litros Totais: ${litrosTotais}</span>
                <span onclick="copiarTexto()" class="w-5/12 font-bold cursor-pointer bg-green-300 hover:bg-green-400 transition duration-150 rounded-md p-2">Copiar Pedidos</span>
                `;
                toggleLoader();
            }else{
                response.innerHTML = `<p class="text-red-500">Erro ao Enviar!</p>`;
            }
        };
        xhr.onerror = function () {
            response.innerHTML = `<p class="text-red-500">Erro de conexão!</p>`;
        };
        xhr.send(formData);
    });

    // Evita o comportamento padrão do navegador ao arrastar arquivos
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
    });

    // Adiciona efeito visual ao arrastar arquivos sobre a área de drop
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add("border-green-500"));
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove("border-green-500"));
    });

    // Evento para soltar os arquivos na área de drop
    dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;

        // Envia os arquivos para o input
        fileInput.files = files;

        // Exibe a lista de arquivos na tela
        showFileList(files);
    });

    // Exibe a lista de arquivos selecionados
    function showFileList(files) {
        fileList.innerHTML = ""; // Limpa a lista anterior

        for (const file of files) {
            const fileItem = document.createElement("p");
            fileItem.textContent = file.name;
            fileList.appendChild(fileItem);
        }
    }

    // Também exibe arquivos selecionados manualmente
    fileInput.addEventListener("change", (e) => {
        showFileList(e.target.files);
    });
});

async function copiarTexto(){
    const areaCopiar = document.getElementById('areaCopiar');
    await navigator.clipboard.writeText(areaCopiar.textContent);
    alert('Pedidos Copiados com Sucesso!');
}