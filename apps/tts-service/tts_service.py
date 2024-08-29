from flask import Flask, request, send_file
import torch

app = Flask(__name__)

# Загрузка моделей Tacotron 2 и WaveGlow
tacotron2 = torch.hub.load('nvidia/DeepLearningExamples:torchhub', 'nvidia_tacotron2')
waveglow = torch.hub.load('nvidia/DeepLearningExamples:torchhub', 'nvidia_waveglow')

# Устанавливаем модели в режим оценки
tacotron2.eval()
waveglow.eval()

@app.route('/synthesize', methods=['POST'])
def synthesize():
    text = request.json.get('text')
    
    # Преобразование текста в спектрограмму
    with torch.no_grad():
        sequence = torch.tensor(tacotron2.text_to_sequence(text, ['english_cleaners']))[None, :]
        mel_outputs, mel_outputs_postnet, _, _ = tacotron2.infer(sequence)
        audio = waveglow.infer(mel_outputs_postnet)

    # Сохранение аудио в файл
    audio_path = 'output.wav'
    torchaudio.save(audio_path, audio.cpu(), sample_rate=22050)

    # Возвращаем файл
    return send_file(audio_path, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
