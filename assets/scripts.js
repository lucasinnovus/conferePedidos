document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.querySelector("label[for='files[]']");
    const fileInput = document.getElementById("files[]");
    const response = document.getElementById('response');
    const form = document.getElementById('upload-form');
    const body = document.body;
    const btn = document.getElementById('buttonform');
    const box = document.getElementById('drop-area');
    const fileList = document.getElementById("file-list");

    function toggleLoader() {
        const loader = document.getElementById("loading");
        loader.classList.toggle("hidden");
    }

    form.addEventListener('submit', function (e) {
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

        xhr.onload = function () {
            if (xhr.status === 200) {
                const resposta = xhr.responseText;
                const pedidos = JSON.parse(resposta);
                const litrosTotais = pedidos.pop(); // Remove o último item (litrosTotais)

                body.classList.remove('h-screen');
                body.classList.add('h-full');
                response.classList.toggle("hidden");

                // Criar elementos sem sobrescrever o HTML diretamente
                response.innerHTML = `
                    <h2 class="text-sm text-blue-600 font-bold">
                        Copie os códigos e insira no banco através da consulta InsertPedidosAEnviar.
                    </h2>
                `;

                const listaPedidos = document.createElement("ul");
                listaPedidos.id = "listaPedidos";
                listaPedidos.classList.add("list-none", "mt-2");

                pedidos.forEach((pedido, index) => {
                    const li = document.createElement("li");
                    li.textContent = pedido + (index !== pedidos.length - 1 ? "," : "");
                    listaPedidos.appendChild(li);
                });

                response.appendChild(listaPedidos);

                const litrosSpan = document.createElement("span");
                litrosSpan.classList.add("text-green-600", "font-bold");
                litrosSpan.textContent = `Litros Totais: ${litrosTotais}`;
                response.appendChild(litrosSpan);

                let copyButton = document.getElementById("copy");
                if (!copyButton) {
                    copyButton = document.createElement("button");
                    copyButton.type = "button";
                    copyButton.id = "copy";
                    copyButton.textContent = "Copiar Pedidos";
                    copyButton.classList.add("mt-2", "w-48", "font-bold", "cursor-pointer", "bg-green-300", "hover:bg-green-400", "transition", "duration-150", "rounded-md", "p-2");
                    response.appendChild(copyButton);

                    copyButton.addEventListener("click", function () {
                        const listaItens = document.querySelectorAll("#listaPedidos li");
                        const textoParaCopiar = Array.from(listaItens)
                            .map(li => li.textContent.trim())
                            .join('\n');

                        navigator.clipboard.writeText(textoParaCopiar)
                            .then(() => alert("Pedidos copiados com sucesso!"))
                            .catch(err => console.error("Erro ao copiar: ", err));
                    });

                }

                toggleLoader();
            } else {
                response.innerHTML = `<p class="text-red-500">Erro ao Enviar!</p>`;
            }
        };

        xhr.onerror = function () {
            response.innerHTML = `<p class="text-red-500">Erro de conexão!</p>`;
        };

        xhr.send(formData);
    });

    // Evita comportamento padrão do navegador ao arrastar arquivos
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
        fileInput.files = files;
        showFileList(files);
        toggleButton();
    });

    function toggleButton(){
        btn.disabled = !btn.disabled;
        btn.classList.remove('bg-gray-300');
        btn.classList.add('bg-green-300');
        btn.classList.remove('cursor-not-allowed');
        btn.classList.add('cursor-pointer');
        btn.classList.add('hover:bg-green-400');
    }
    // Exibe a lista de arquivos selecionados de forma mais organizada
    function showFileList(files) {
        fileList.innerHTML = "<ul class='mt-2'>"; // Inicia a lista
        for (const file of files) {
            fileList.innerHTML += `<li class="text-gray-600">${file.name}</li>`;
        }
        fileList.innerHTML += "</ul>"; // Fecha a lista
    }

    // Exibe arquivos selecionados manualmente
    fileInput.addEventListener("change", (e) => {
        showFileList(e.target.files);
    });
});
