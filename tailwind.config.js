// Paths to the files that will use Tailwind CSS class names:

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'    
  ],
  theme: {
    extend: {
      backgroundImage:{        
        'nes':"url('/platforms/NES_logo.svg')",
        'snes':"url('/platforms/SNES_logo.svg')",
        'n64':"url('/platforms/Nintendo_64_Logo.svg')",
        'gamecube':"url('/platforms/Nintendo_Gamecube_Logo.svg')",
        'wii':"url('/platforms/Wii.svg')",
        'wiiu':"url('/platforms/WiiU.svg')",
        'nintendoswitch':"url('/platforms/NintendoSwitchLogo.svg')",
        'gameboy':"url('/platforms/Nintendo_Game_Boy_Logo.svg')",
        'gameboycolor':"url('/platforms/Game_Boy_Color_logo.svg')",
        'gameboyadvance':"url('/platforms/Game_Boy_Advance_logo.svg')",
        'nintendods':"url('/platforms/Nintendo_DS_Logo.svg')",
        'nintendo3ds':"url('/platforms/Nintendo_3ds_logo.svg')",
        'segamastersystem':"url('/platforms/Sega_Master_System.svg')",
        'segagenesis':"url('/platforms/Sega_Genesis_Logo.png')",
        'segacd':"url('/platforms/Sega_CD_Logo.svg')",
        'sega32x':"url('/platforms/Sega_32X_logo.svg')",
        'segasaturn':"url('/platforms/Sega_Saturn_Logo.png')",
        'segadreamcast':"url('/platforms/Dreamcast_logo.svg')",
        'segagamegear':"url('/platforms/Game_gear_us-jp_logo.svg')",
        'playstation':"url('/platforms/playstation_logo.png')",
        'playstation2':"url('/platforms/PlayStation_2_logo.svg')",
        'playstation3':"url('/platforms/PlayStation_3_logo.svg')",
        'playstation4':"url('/platforms/PlayStation_4_logo_and_wordmark.svg')",
        'playstation5':"url('/platforms/PlayStation_5_logo_and_wordmark.svg')",
        'playstationportable':"url('/platforms/PSP_Logo.svg')",
        'playstationvita':"url('/platforms/PlayStation_Vita_logo.svg')",
        'xbox':"url('/platforms/XBox_Logo.svg')",
        'xbox360':"url('/platforms/Xbox_360_full_logo.svg')",
        'xboxone':"url('/platforms/X_Box_One_logo.svg')",
        'xboxseriesxs':"url('/platforms/Xbox_Series_X_S_color.svg')",
        'amiga':"url('/platforms/Commodore_Amiga_logo.svg')",
        'atari2600':"url('/platforms/Atari2600logo.svg')",
        'atari5200':"url('/platforms/Atari_5200_logo.svg')",
        'atari7800':"url('/platforms/Atari_7800_logo.svg')",
        'atarist':"url('/platforms/Atari_ST_logo.svg')",        
        'atari400':"url('/platforms/Atari_400_logo.svg')",
        'atari800':"url('/platforms/Atari_800_logo.svg')",
        'atarixegs':"url('/platforms/Atari_XEGS_logo.svg')",
        'atarijaguar':"url('/platforms/Atari_Jaguar_logo.svg')",
        'atarilynx':"url('/platforms/Atari_Lynx_logo.svg')",
        'atari-flashback-classics':"url('/platforms/afc-logo.png')",
        '3do':"url('/platforms/3DO_Logo.svg')",
        'neogeo':"url('/platforms/Neogeo-logo.svg')",
        'windowspc':"url('/platforms/Windows_logo.svg')",
        'macos':"url('/platforms/MacOS_logo.svg')",
        'classicmacintosh':"url('/platforms/classic_macintosh_logo.svg')",
        'appleII':"url('/platforms/Apple2Logo.svg')",
        'linux':"url('/platforms/Linux_Logo.svg')",
        'android':"url('/platforms/Android_logo.svg')",
        'ios':"url('/platforms/ios_logo.svg')",
        'web':"url('/platforms/web_logo.svg')",
        'comment':"url('/comment.svg')"        
      },
      fontFamily:{
        cairo: ['var(--font-cairo)']
      }
    },
  },
  plugins: [require("daisyui")],
}