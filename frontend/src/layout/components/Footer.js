import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import { FaFacebook, FaYoutube, FaLinkedin, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-8 pb-10 bg-main p-6 pl-10 text-white">
      {/* Column 1 */}
      <div className="leading-relaxed">
        <div className="mb-4">
          <div className="flex items-center h-full">
            <img className="h-[48px] mr-4" src="/logo.png" alt="logo" />
            <div className="font-cherry text-[30px]">Novelaholic</div>
          </div>
        </div>

        <div className="text-[15px] font-light">
          <div>Khoa Công nghệ thông tin,</div>
          <div className="mb-2">Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM</div>
          <div>Thiết kế phần mềm,</div>
          <div>Nhóm 09 - CQ2021/3</div>
        </div>
      </div>

      {/* Column 2 */}
      <div className="lg:col-span-2 lg:ml-16">
        <div className="text-[20px] font-bold mb-7 mt-4">Thông tin liên hệ</div>

        <div className="text-[15px] font-light">
          <div className="flex mb-4 leading-relaxed">
            <FaLocationDot size={20} className="mr-3" />
            <div>
              Khu đô thị ĐHQG, Khu phố 6, Phường Linh Trung, Thành phố Thủ
              Đức, TP.HCM
            </div>
          </div>

          <div className="flex">
            <BsFillTelephoneFill size={17} className="mr-3 ml-1" />
            <div className="mb-4 leading-relaxed">(+84) 949213040</div>
          </div>

          <div className="flex">
            <IoIosMail size={22} className="mr-3" />
            <a
              className="transition ease-in-out hover:translate-x-2 duration-200 mt-1"
              href="mailto:21120553@student.hcmus.edu.vn"
            >
              21120553@student.hcmus.edu.vn
            </a>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div>
        <div className="text-[20px] font-bold mb-7 mt-4">Liên kết</div>

        <div className="text-[16px] font-light">
          <div className="mb-4 leading-relaxed transition ease-in-out hover:translate-x-2 duration-200">
            <a href="https://hcmus.edu.vn/">Website Trường</a>
          </div>

          <div className="mb-6 leading-relaxed transition ease-in-out hover:translate-x-2 duration-200">
            <a href="https://www.fit.hcmus.edu.vn/">
              Website Khoa Công nghệ thông tin
            </a>
          </div>

          <div className="flex flex-wrap">
            <a
              className="mr-4 transition ease-in-out hover:translate-x-1 duration-200"
              href="https://www.facebook.com/fit.hcmus"
            >
              <FaFacebook size={30} />
            </a>

            <a
              className="mr-4 transition ease-in-out hover:translate-x-1 duration-200"
              href="https://www.youtube.com/c/FITHCMUSOfficial"
            >
              <FaYoutube size={30} />
            </a>

            <a
              className="mr-4 transition ease-in-out hover:translate-x-1 duration-200"
              href="https://www.linkedin.com/company/fithcmus/"
            >
              <FaLinkedin size={30} />
            </a>

            <a
              className="transition ease-in-out hover:translate-x-1 duration-200"
              href="https://www.tiktok.com/@fit.hcmus"
            >
              <FaTiktok size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
