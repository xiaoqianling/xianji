# 课程与曲谱

编排参考 [JustinGuitar Beginner](https://www.justinguitar.com/beginner) 的入门到进阶顺序，以及 [Fender Play First Chords](https://www.fender.com/play/guitar/collections/acoustic-guitar-quick-practice-plans/courses/acoustic-guitar-skill-practice-plan-first-chords?course-number=1) 的短时练习思路。应用内的中文讲解、练习步骤和目标独立编写。

课程从空弦、品位和六线谱起步。开放和弦之后练四拍扫弦、分解和弦、6/8 和横按，再用音程、大调级数、五声音阶与十二小节蓝调串联应用。

内置《小星星》《欢乐颂》《两只老虎》《玛丽有只小羊羔》的传统旋律简编，以及原创练习《檐下听雨》。旋律自行转写为六线谱，试听由 Web Audio 合成。可查阅 [美国国会图书馆《小星星》历史乐谱](https://www.loc.gov/resource/music.mussm-sm1879-02893/?st=gallery)。

## 新增内容

1. 在 `content/catalog.json` 加课程或曲目。已有 ID 保持稳定。
2. 课程提供分钟数、概念、练习动作、听辨提醒、验收目标及建议 BPM。和弦名称引用 `chords`。
3. 曲谱中的每个音符有弦号、品位和以四分音符计的拍长。弦号 1 为最细弦。每小节拍长加总应等于 meter。
4. 运行 `npm test`，在界面核对换弦、时值、谱面和试听。新增曲目同时记录旋律来源和编配归属。
