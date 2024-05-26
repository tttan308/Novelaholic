import React, { useState, useEffect } from "react";
import ReadMore from "../components/readmore";
import ListChapter from "../components/listChapter";

function BookInfo() {
  const book = {
    title: "Nàng không muốn làm hoàng hậu",
    author: "Thâm Bích Sắc",
    genre: "Ngôn tình, Cổ đại, Ngược, Khác",
    status: "Hoàn thành",
    description:
      "Phụ mẫu Vân Kiều mất sớm, một mình nàng tự buôn bán nhỏ, còn nhặt được một thư sinh nghèo mi thanh mục tú về làm phu quân, mỗi ngày trôi qua cũng có chút thú vị.\n\nSau này, khi phu quân nàng vào kinh đi thi, hắn bỗng nhiên trở thành Thái tử tôn quý.\n\nAi ai cũng đều nói Vân Kiều nàng có phúc, ấy vậy mà lại được gả cho hoàng tử lưu lạc ở dân gian. Song, Vân Kiều lại cảm thấy vô cùng hụt hẫng.\n\nNàng không quen với cuộc sống cẩm y ngọc thực, cũng không am hiểu cầm kỳ thi hoạ, phong hoa tuyết nguyệt, thậm chí chữ viết cũng rất xấu. Hoa phục của Trung cung mặc lên người nàng không hề giống một Hoàng Hậu.\n\nVân Kiều cẩn tuân lời dạy bảo của Thái hậu, học quy củ, tuân thủ lễ nghi, không sân si, không đố kị, mãi đến khi Bùi Thừa Tư tìm được bạch nguyệt quang trong lòng hắn. Cuối cùng, nàng mới hiểu, hoá ra Bùi Thừa Tư cũng có thể yêu một người đến vậy.\n\nNgày Bùi Thừa Tư sửa tên đổi họ cho bạch nguyệt quang đã mất phu quân kia, cho nàng ta tiến cung phong phi, Vân Kiều uống chén thuốc phá thai làm mất đi hài tử mà chính nàng đã mong đợi.\n\nĐối mặt với cơn giận lôi đình của Bùi Thừa Tư, nàng không màng đến vị trí Hoàng hậu, nàng muốn về lại trấn Quế Hoa.\n\nNàng ghét phải nhìn bầu trời nhỏ hẹp trong cung cấm, nàng muốn trở về thị trấn nhỏ, thiên hạ rộng lớn, hương thơm tỏa khắp đất trời vào cuối thu. Nàng cũng ghét nhìn thấy Bùi Thừa Tư.\n\nTừ đầu tới cuối, nàng chỉ yêu chàng thư sinh áo xanh phóng khoáng nọ, chỉ cần nhìn thoáng qua cũng thấy yêu thích vô cùng. Tiếc là, từ lúc hắn rời trấn vào kinh, hắn đã chết rồi.\n\nVai chính: Vân kiều ┃ vai phụ: Những người còn lại.\n\nLập ý: Nếu ngươi vô tình vậy thì ta sẽ hưu.",
    coverImageUrl: "/sample_book.png",
  };

  const initchapters = [
    {
      chapter: 1,
      title: "Nàng không tin Yến Đình lại lừa nàng chuyện lớn đến vậy!",
      viewed: false,
    },
    { chapter: 2, title: "Ngũ hoàng tử bùi thừa tư trở về!", viewed: false },
    { chapter: 3, title: "Oan gia ngõ hẹp!", viewed: false },
    { chapter: 4, title: "Đây chính là thành trường an", viewed: false },
    { chapter: 5, title: "Dám quấy nhiễu xa giá của điện hạ", viewed: false },
    { chapter: 6, title: "", viewed: false },
    {
      chapter: 7,
      title: "Hoá ra ác nhân còn không biết xấu hổ đi cáo trạng trước!",
      viewed: false,
    },
    {
      chapter: 8,
      title: "Phu quân ngươi đâu? sao hắn không đến cứu ngươi?",
      viewed: false,
    },
    {
      chapter: 9,
      title: "Ngươi vừa nói vân cô nương kia tên là gì?",
      viewed: false,
    },
    { chapter: 10, title: "Sao bây giờ chàng mới đến tìm ta", viewed: false },
    {
      chapter: 11,
      title: "Hoá ra chỉ có nàng là tự cho mình đúng!",
      viewed: false,
    },
    { chapter: 12, title: "Hắn cúi người hôn lên môi nàng!", viewed: false },
    {
      chapter: 13,
      title: "Ai càng lún sâu vào tình ái thì người ấy không thể làm được gì!",
      viewed: false,
    },
    {
      chapter: 14,
      title: "Giống như nàng đang gấp gáp đòi danh phận!",
      viewed: false,
    },
    { chapter: 15, title: "Ngoan!", viewed: false },
    {
      chapter: 16,
      title: "Nghiêm khắc với nàng là muốn nàng được tốt hơn!",
      viewed: false,
    },
    { chapter: 17, title: "", viewed: false },
    { chapter: 18, title: "Phó dư!", viewed: false },
    {
      chapter: 19,
      title: "Có người không muốn để nàng yên ổn!",
      viewed: false,
    },
    {
      chapter: 20,
      title: "Có phải uy hiếp hay không, quận chúa có thể thử!",
      viewed: false,
    },
    {
      chapter: 21,
      title: "Các nàng không canh chừng nàng cẩn thận, đương nhiên sẽ bị phạt!",
      viewed: false,
    },
    {
      chapter: 22,
      title: "Bùi thừa tư, rốt cuộc chàng xem ta là gì?",
      viewed: false,
    },
    { chapter: 23, title: "Giam cầm và phong hậu!", viewed: false },
    {
      chapter: 24,
      title: "a sẽ không xem chàng quan trọng hơn bản thân mình nữa!",
      viewed: false,
    },
    { chapter: 25, title: "Ba lời hứa!", viewed: false },
    {
      chapter: 26,
      title: "Nàng không tin Yến Đình lại lừa nàng chuyện lớn đến vậy!",
      viewed: false,
    },
    { chapter: 27, title: "Ngũ hoàng tử bùi thừa tư trở về!", viewed: false },
    { chapter: 28, title: "Oan gia ngõ hẹp!", viewed: false },
    { chapter: 29, title: "Đây chính là thành trường an", viewed: false },
    { chapter: 30, title: "Dám quấy nhiễu xa giá của điện hạ", viewed: false },
    { chapter: 31, title: "", viewed: false },
    {
      chapter: 32,
      title: "Hoá ra ác nhân còn không biết xấu hổ đi cáo trạng trước!",
      viewed: false,
    },
    {
      chapter: 33,
      title: "Phu quân ngươi đâu? sao hắn không đến cứu ngươi?",
      viewed: false,
    },
    {
      chapter: 34,
      title: "Ngươi vừa nói vân cô nương kia tên là gì?",
      viewed: false,
    },
    { chapter: 35, title: "Sao bây giờ chàng mới đến tìm ta", viewed: false },
    {
      chapter: 36,
      title: "Hoá ra chỉ có nàng là tự cho mình đúng!",
      viewed: false,
    },
    { chapter: 37, title: "Hắn cúi người hôn lên môi nàng!", viewed: false },
    {
      chapter: 38,
      title: "Ai càng lún sâu vào tình ái thì người ấy không thể làm được gì!",
      viewed: false,
    },
    {
      chapter: 39,
      title: "Giống như nàng đang gấp gáp đòi danh phận!",
      viewed: false,
    },
    { chapter: 40, title: "Ngoan!", viewed: false },
    {
      chapter: 41,
      title: "Nghiêm khắc với nàng là muốn nàng được tốt hơn!",
      viewed: false,
    },
    { chapter: 42, title: "", viewed: false },
    { chapter: 43, title: "Phó dư!", viewed: false },
    {
      chapter: 44,
      title: "Có người không muốn để nàng yên ổn!",
      viewed: false,
    },
    {
      chapter: 45,
      title: "Có phải uy hiếp hay không, quận chúa có thể thử!",
      viewed: false,
    },
    {
      chapter: 46,
      title: "Các nàng không canh chừng nàng cẩn thận, đương nhiên sẽ bị phạt!",
      viewed: false,
    },
    {
      chapter: 47,
      title: "Bùi thừa tư, rốt cuộc chàng xem ta là gì?",
      viewed: false,
    },
    { chapter: 48, title: "Giam cầm và phong hậu!", viewed: false },
    {
      chapter: 49,
      title: "a sẽ không xem chàng quan trọng hơn bản thân mình nữa!",
      viewed: false,
    },
    { chapter: 50, title: "Ba lời hứa!", viewed: false },
  ];

  const [chapters, setChapters] = useState(initchapters);

  // update click chapter action
  const handleChapterClick = (chapterIndex) => {
    console.log("number of chapter: ", chapters.length);
    console.log("clicked chapter: ", chapterIndex);
    console.log("before click: ", chapters[chapterIndex - 1].viewed);
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex - 1].viewed = true;

    setChapters(updatedChapters);
    console.log("view in chapter click", chapters[chapterIndex - 1].viewed);
    //update in localStorage
    // [...]
  };

  return (
    <div className="inline">
      <div className="container px-8">
        <h1 className="text-2xl font-bold font-Poppins">Thông tin truyện</h1>
        <hr className="w-56 h-1 bg-main" />
      </div>

      <div>
        <h1 className="font-Poppins font-bold text-2xl text-main text-center">
          {book.title}
        </h1>
      </div>

      <div class="main relative">
        <div className="flex w-full justify-center">
          <div>
            <img src={book.coverImageUrl} alt="book image" />
          </div>
          <div className="bookDetail grid-flow-col pt-7 pl-9">
            <div className="Author grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Tác giả
              </h1>
              <h1 className="col-span-7">{book.author}</h1>
            </div>
            <div className="Type grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Thể loại
              </h1>
              <h1 className="col-span-7">{book.genre}</h1>
            </div>
            <div className="Status grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Trạng thái
              </h1>
              <h1 className="col-span-7">{book.status}</h1>
            </div>

            <div className="groupDesc pt-6">
              <h1 className="text-base font-bold font-Poppins text-sub">
                Mô tả
              </h1>
              <ReadMore
                fullText={book.description}
                numberOfChapter={chapters.length}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="listChapter">
        <div className="container px-8">
          <h1 className="text-2xl font-bold font-Poppins">Danh sách chương</h1>
          <hr className="w-[260px] h-1 bg-main" />
        </div>

        <ListChapter
          className=""
          data={chapters}
          chapterPerPage={7}
          currentPage={1}
          clickAction={handleChapterClick}
        />
      </div>
    </div>
  );
}

export default BookInfo;
