// The valid icon names that can be used for "name" prop
type IconType =
  | "instagram"
  | "telegram"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "email"
  | "path-link";

// Define the props for the Icon component
interface IconProps {
  name: IconType; // The "name" prop must be one of the valid icon names
}

const Icon = ({ name }: IconProps) => {
  switch (name) {
    // Instagram icon
    case "instagram":
      return (
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_258_412)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.0001 46.7797C39.2672 46.7797 46.7798 39.2671 46.7798 30C46.7798 20.7328 39.2672 13.2203 30.0001 13.2203C20.733 13.2203 13.2205 20.7328 13.2205 30C13.2205 39.2671 20.733 46.7797 30.0001 46.7797ZM30.0001 41.1864C36.1781 41.1864 41.1866 36.178 41.1866 30C41.1866 23.8219 36.1781 18.8136 30.0001 18.8136C23.822 18.8136 18.8137 23.8219 18.8137 30C18.8137 36.178 23.822 41.1864 30.0001 41.1864Z"
            />
            <path d="M46.2288 11.1864C44.848 11.1864 43.7288 12.3057 43.7288 13.6864C43.7288 15.0671 44.848 16.1864 46.2288 16.1864C47.6095 16.1864 48.7288 15.0671 48.7288 13.6864C48.7288 12.3057 47.6095 11.1864 46.2288 11.1864Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.78353 8.93471C0 12.4351 0 17.0173 0 26.1818V33.8182C0 42.9826 0 47.565 1.78353 51.0652C3.35236 54.1443 5.85567 56.6476 8.93471 58.2164C12.4351 60 17.0173 60 26.1818 60H33.8182C42.9826 60 47.565 60 51.0652 58.2164C54.1443 56.6476 56.6476 54.1443 58.2164 51.0652C60 47.565 60 42.9826 60 33.8182V26.1818C60 17.0173 60 12.4351 58.2164 8.93471C56.6476 5.85567 54.1443 3.35236 51.0652 1.78353C47.565 0 42.9826 0 33.8182 0H26.1818C17.0173 0 12.4351 0 8.93471 1.78353C5.85567 3.35236 3.35236 5.85567 1.78353 8.93471ZM33.8182 5.45455H26.1818C21.5096 5.45455 18.3334 5.4588 15.8784 5.65936C13.487 5.85475 12.2641 6.20888 11.411 6.64355C9.35834 7.68946 7.68946 9.35834 6.64355 11.411C6.20888 12.2641 5.85475 13.487 5.65936 15.8784C5.4588 18.3334 5.45455 21.5096 5.45455 26.1818V33.8182C5.45455 38.4905 5.4588 41.6665 5.65936 44.1215C5.85475 46.5131 6.20888 47.736 6.64355 48.5891C7.68946 50.6416 9.35834 52.3105 11.411 53.3564C12.2641 53.7911 13.487 54.1454 15.8784 54.3406C18.3334 54.5411 21.5096 54.5455 26.1818 54.5455H33.8182C38.4905 54.5455 41.6665 54.5411 44.1215 54.3406C46.5131 54.1454 47.736 53.7911 48.5891 53.3564C50.6416 52.3105 52.3105 50.6416 53.3564 48.5891C53.7911 47.736 54.1454 46.5131 54.3406 44.1215C54.5411 41.6665 54.5455 38.4905 54.5455 33.8182V26.1818C54.5455 21.5096 54.5411 18.3334 54.3406 15.8784C54.1454 13.487 53.7911 12.2641 53.3564 11.411C52.3105 9.35834 50.6416 7.68946 48.5891 6.64355C47.736 6.20888 46.5131 5.85475 44.1215 5.65936C41.6665 5.4588 38.4905 5.45455 33.8182 5.45455Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_258_412">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // Telegram icon
    case "telegram":
      return (
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_257_400)">
            <path d="M55.1197 5.44155C47.1381 8.74731 12.9142 22.9233 3.45813 26.7869C-2.88353 29.2617 0.828966 31.5821 0.828966 31.5821C0.828966 31.5821 6.24234 33.438 10.8831 34.8301C15.5232 36.2222 17.998 34.6757 17.998 34.6757L39.8072 19.9814C47.541 14.7225 45.6851 19.0532 43.8285 20.9097C39.8072 24.9316 33.1561 31.2727 27.5877 36.3773C25.1129 38.5426 26.35 40.3985 27.4333 41.3268C31.4546 44.7299 42.437 51.6904 43.0552 52.1542C46.3227 54.4675 52.75 57.7972 53.7276 50.7621L57.5945 26.4781C58.8322 18.2806 60.0693 10.7012 60.2237 8.53583C60.6881 3.2762 55.1197 5.44155 55.1197 5.44155Z" />
          </g>
          <defs>
            <clipPath id="clip0_257_400">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // Github icon
    case "github":
      return (
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_258_437)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30 0C46.569 0 60 13.7698 60 30.7588C60 44.3458 51.414 55.8719 39.501 59.9429C37.98 60.2459 37.44 59.2853 37.44 58.4663C37.44 57.4523 37.476 54.1404 37.476 50.0244C37.476 47.1564 36.516 45.2846 35.439 44.3306C42.12 43.5686 49.14 40.9673 49.14 29.1533C49.14 25.7933 47.976 23.0515 46.05 20.8975C46.362 20.1205 47.391 16.9919 45.756 12.7559C45.756 12.7559 43.242 11.9317 37.515 15.9097C35.118 15.2287 32.55 14.886 30 14.874C27.45 14.886 24.885 15.2287 22.491 15.9097C16.758 11.9317 14.238 12.7559 14.238 12.7559C12.609 16.9919 13.638 20.1205 13.947 20.8975C12.03 23.0515 10.857 25.7933 10.857 29.1533C10.857 40.9373 17.862 43.5785 24.525 44.3555C23.667 45.1235 22.89 46.4783 22.62 48.4673C20.91 49.2533 16.566 50.6136 13.89 45.9126C13.89 45.9126 12.303 42.9572 9.291 42.7412C9.291 42.7412 6.366 42.7024 9.087 44.6104C9.087 44.6104 11.052 45.5554 12.417 49.1104C12.417 49.1104 14.178 54.6002 22.524 52.7402C22.539 55.3112 22.566 57.7343 22.566 58.4663C22.566 59.2793 22.014 60.2308 20.517 59.9458C8.59499 55.8808 0 44.3488 0 30.7588C0 13.7698 13.434 0 30 0Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_258_437">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // Linkedin icon
    case "linkedin":
      return (
        <svg
          width="59"
          height="59"
          viewBox="0 0 59 59"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_258_408)">
            <path d="M54.2787 0.00529124H5.05176C4.41726 -0.0244273 3.7831 0.0712555 3.18563 0.286918C2.58816 0.50258 2.0391 0.833944 1.56984 1.26202C1.10062 1.69014 0.720411 2.2066 0.451045 2.7818C0.18168 3.35703 0.0283931 3.97972 0 4.61424V53.9486C0.0371691 55.2763 0.581357 56.5399 1.5208 57.479C2.46024 58.4185 3.7237 58.9628 5.05176 59H54.2787C55.5697 58.9425 56.7869 58.3813 57.6693 57.437C58.5517 56.4927 59.0289 55.2406 58.9986 53.9486V4.61424C59.0093 3.99664 58.8936 3.38343 58.6587 2.81214C58.4238 2.24089 58.0746 1.72362 57.6325 1.29204C57.1907 0.860491 56.6652 0.523781 56.0885 0.302514C55.5118 0.0812478 54.896 -0.0198921 54.2787 0.00529124ZM18.4371 49.1921H9.8454V22.9027H18.4371V49.1921ZM14.344 18.9204C13.7445 18.9413 13.1471 18.838 12.5894 18.617C12.0317 18.396 11.5257 18.0621 11.1033 17.6362C10.6808 17.2103 10.351 16.7016 10.1345 16.1422C9.91804 15.5827 9.81962 14.9845 9.8454 14.3852C9.81889 13.7794 9.91929 13.1748 10.1402 12.6101C10.3611 12.0454 10.6976 11.5331 11.1281 11.1061C11.5587 10.679 12.0737 10.3467 12.6402 10.1304C13.2067 9.9141 13.8122 9.8186 14.4178 9.85002C15.0173 9.82915 15.6147 9.93242 16.1724 10.1534C16.7301 10.3744 17.2361 10.7084 17.6586 11.1343C18.081 11.5602 18.4109 12.0688 18.6273 12.6283C18.8438 13.1877 18.9422 13.7859 18.9164 14.3852C18.943 14.991 18.8425 15.5956 18.6216 16.1603C18.4007 16.7251 18.0642 17.2374 17.6337 17.6644C17.2032 18.0914 16.6881 18.4237 16.1216 18.64C15.5551 18.8564 14.9496 18.9518 14.344 18.9204ZM49.1901 49.1921H40.5616V34.8122C40.5616 31.3832 39.3447 29.0234 36.2842 29.0234C35.3335 29.0315 34.4084 29.3335 33.6362 29.888C32.8637 30.4426 32.2818 31.2224 31.9699 32.1206C31.7302 32.7939 31.6299 33.5088 31.6749 34.2223V49.1921H23.1938V22.9027H31.6749V26.5898C32.429 25.2046 33.5511 24.0549 34.9176 23.2673C36.2842 22.4801 37.8417 22.0859 39.4185 22.1283C44.9865 22.1283 49.1901 25.8155 49.1901 33.6692V49.1921Z" />
          </g>
          <defs>
            <clipPath id="clip0_258_408">
              <rect width="59" height="59" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // Whatsapp icon
    case "whatsapp":
      return (
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_258_416)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M47.463 42.3633C46.74 44.4099 43.866 46.103 41.574 46.5981C40.005 46.9312 37.959 47.1948 31.065 44.3379C23.322 41.1299 12.57 29.7029 12.57 22.0986C12.57 18.2275 14.802 13.7197 18.705 13.7197C20.583 13.7197 20.997 13.7563 21.615 15.2388C22.338 16.9853 24.102 21.2884 24.312 21.7295C25.179 23.539 23.43 24.5983 22.161 26.1738C21.756 26.6479 21.297 27.1607 21.81 28.043C22.32 28.9072 24.084 31.7822 26.676 34.0898C30.024 37.0727 32.739 38.0251 33.711 38.4302C34.434 38.7303 35.298 38.6604 35.826 38.0962C36.495 37.373 37.326 36.1731 38.172 34.9907C38.769 34.1445 39.528 34.0388 40.323 34.3389C40.86 34.5249 47.685 37.6945 47.973 38.2017C48.186 38.5708 48.186 40.3167 47.463 42.3633ZM30.006 0H29.991C13.452 0 0 13.4561 0 30C0 36.56 2.11502 42.646 5.71202 47.5825L1.97401 58.73L13.503 55.0459C18.246 58.1849 23.907 60 30.006 60C46.545 60 60 46.5439 60 30C60 13.4561 46.545 0 30.006 0Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_258_416">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // Email icon
    case "email":
      return (
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_747_1503)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.888 4.18604C11.3649 4.18604 7.27473 5.3165 4.30596 8.0732C1.30904 10.8561 -0.216309 14.9887 -0.216309 20.2904V39.8957C-0.216309 45.1975 1.30904 49.33 4.30596 52.1128C7.27473 54.8696 11.3649 56 15.888 56H43.8956C48.4188 56 52.509 54.8696 55.4775 52.1128C58.4746 49.33 59.9999 45.1975 59.9999 39.8957V20.2904C59.9999 14.9887 58.4746 10.8561 55.4775 8.0732C52.509 5.3165 48.4188 4.18604 43.8956 4.18604H15.888ZM50.1371 19.9047C51.0549 19.1954 51.224 17.8762 50.5146 16.9582C49.8055 16.0402 48.4863 15.8711 47.5682 16.5804L32.0321 28.5851C30.7715 29.5595 29.0118 29.5595 27.7509 28.5851L12.2151 16.5804C11.2971 15.8711 9.97793 16.0402 9.26859 16.9582C8.55924 17.8762 8.72838 19.1954 9.64638 19.9047L25.1823 31.9096C27.9562 34.0527 31.8271 34.0527 34.601 31.9096L50.1371 19.9047Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_747_1503">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    // path-link icon
    case "path-link":
      return (
        <svg
          width="15"
          height="14"
          viewBox="0 0 15 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.53227 3.64139H2.60014C2.13608 3.64139 1.75948 4.01799 1.75948 4.48205V11.7844C1.75948 12.2485 2.13608 12.6251 2.60014 12.6251H9.91939C10.3835 12.6251 10.76 12.2485 10.76 11.7844V5.89139H11.8848V12.0643C11.8848 12.9946 11.1293 13.7501 10.1987 13.7504H2.32086C1.3902 13.7504 0.634766 12.9946 0.634766 12.0643V4.20221C0.634766 3.27155 1.3902 2.51611 2.32086 2.51611H8.53227V3.64139Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.1284 5.12125H13.002V2.17347L5.15685 10.0184L4.36035 9.22188L12.2058 1.37641H9.25719V0.25H14.1279L14.1284 0.250281V5.12125Z"
          />
        </svg>
      );
  }
};

export default Icon;
