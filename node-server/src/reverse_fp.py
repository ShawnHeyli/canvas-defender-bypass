import json
import base64
from PIL import Image

def fingerprint_from_noised(noised: str, r: int, g: int, b: int, a: int):
    noised_canvas = Image.open(noised)
    pix = noised_canvas.load()
    for i in range(noised_canvas.size[0]):
        for j in range(noised_canvas.size[1]):
            pr, pg, pb, pa = pix[i,j]

            pix[i,j] = (pr - r, pg - g, pb - b, pa - a)
    
    noised_canvas.save("unnoised.png")
    data = base64.b64encode(noised_canvas.tobytes()).decode("utf-8")
    return data

data = fingerprint_from_noised("test.png", -10,25,13,7)
print(data)