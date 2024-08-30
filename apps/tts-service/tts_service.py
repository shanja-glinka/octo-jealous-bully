from flask import Flask, request, jsonify
import torch
from scipy.io.wavfile import write
import os
from dotenv import load_dotenv

# Загрузка .env файла двумя директориями выше
load_dotenv('../../.env')
print(torch.zeros(1).cuda())
app = Flask(__name__)

os.environ['CURL_CA_BUNDLE'] = ''

torch.hub._validate_not_a_forked_repo=lambda a,b,c: True

# Загрузка моделей Tacotron 2 и WaveGlow
# tacotron2 = torch.hub.load('nvidia/DeepLearningExamples:torchhub', 'nvidia_tacotron2')
# waveglow = torch.hub.load(
#     'nvidia/DeepLearningExamples:torchhub', 'nvidia_waveglow', pretrained = True)
## https://drive.usercontent.google.com/download?id=1c5ZTuT7J08wLUoVZ2KkUs_VdZuJ86ZqA&export=download&authuser=0
tacotron2 = torch.load('tacotron2_statedict.pt', map_location=torch.device('cpu'))
## https://drive.usercontent.google.com/download?id=1rpK8CzAAirq9sWZhe9nlfvxMF1dRgFbF&export=download&authuser=0
waveglow = torch.load('waveglow_256channels_universal_v5.pt', map_location=torch.device('cpu'))

# Устанавливаем модели в режим оценки
tacotron2.eval()
waveglow.eval()


@app.route('/synthesize', methods=['POST'])
def synthesize():
    text = request.json.get('text')
    output_file_name = request.json.get('output')
    output_storage_dir = request.json.get('storage_dir')

    if not output_storage_dir:
        return jsonify({"file_path": null})

    # Генерируем имя файла, если не указано
    output_file_name = output_file_name if output_file_name else 'output.wav'

    # Создаем директорию, если она не существует
    os.makedirs(output_storage_dir, exist_ok=True)

    # Полный путь к файлу для сохранения
    full_output_path = os.path.join(output_storage_dir, output_file_name)

    # Преобразование текста в спектрограмму
    with torch.no_grad():
        sequence = torch.tensor(tacotron2.text_to_sequence(
            text, ['english_cleaners']))[None, :]
        mel_outputs, mel_outputs_postnet, _, _ = tacotron2.infer(sequence)
        audio = waveglow.infer(mel_outputs_postnet)

    # Преобразование аудио тензора в формат numpy для сохранения
    audio_numpy = audio[0].cpu().numpy()

    # Сохранение аудио в файл
    write(full_output_path, 22050, audio_numpy)

    # Относительный путь к файлу (например, "/public/uploads/texts/output.wav")
    relative_path = os.path.relpath(full_output_path, os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))))

    # Возвращаем путь к файлу
    return jsonify({"file_path": f"/{relative_path}"})


if __name__ == '__main__':
    # Получаем хост и порт из переменных окружения, если они заданы
    host = os.getenv('TTS_SERVICE_HOST', '0.0.0.0')
    port = int(os.getenv('TTS_SERVICE_PORT', 4000))

    app.run(host=host, port=port)
