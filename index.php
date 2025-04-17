<!doctype html>
<html data-theme="corporate" lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
    <script src="assets/scripts.js"></script>
    <title>Confere - Pedidos</title>
</head>
<body class="min-h-screen overflow-auto flex bg-gray-200 items-center justify-center ">
<div class="flex w-6/12 border-2 bg-white shadow-sm border-gray-300 m-2 p-16 items-center justify-center">
    <form id="upload-form" method="post" enctype="multipart/form-data" action="uploadPlanilhas.php">
        <div id="box" class="flex justify-center items-center flex-col gap-4">
            <div class="flex flex-row items-center justify-center w-12/12 gap-2">
                <img class="w-5/12" src="https://www.cativo.com.br/wp-content/uploads/2020/04/Cativo_logo_png.png" alt="cativo">
                <img class="w-5/12" src="https://cdn.pli-petronas.com/s3fs-public/img_PETRONAS_Lubricants_International.png?VersionId=h0CkkEGuHmnHR9aH4K4fx84vg.s4obep" alt="petronas">
            </div>
            <div id="drop-area" class="border-2 border-dashed border-gray-400 p-6 rounded-md w-full text-center">
                <label for="files[]" class="cursor-pointer flex flex-col gap-4">
                    <strong>Selecione as planilhas Cativo e Petronas</strong>
                    <span>ou arraste elas aqui!</span>
                    <input id="files[]" type="file" class="hidden " name="files[]" multiple>
                </label>
            </div>
            <ul class="list-disc" id="file-list"></ul>
            <label id="loading" class="flex hidden justify-center items-center">
                <img alt="loader" class="w-4/12" src="assets/images/loader.gif"/>
            </label>
            <button id="buttonform" name="submit" type="submit" disabled class="w-8/12 cursor-not-allowed bg-gray-300 transition duration-150 rounded-md p-2">
                <span class="font-bold">Enviar Planilhas</span>
            </button>
            <div id="response" class="mt-4 flex-col gap-3 hidden flex justify-center items-center text-center text-gray-700">
            </div>
        </div>
    </form>
</div>
</body>
</html>