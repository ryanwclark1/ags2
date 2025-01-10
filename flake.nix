{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    systems = ["x86_64-linux" "aarch64-linux"];
    forEachSystem = nixpkgs.lib.genAttrs systems;
  in {
    packages = forEachSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "my-shell";
        entry = "app.ts";

        extraPackages =
          (with ags.packages.${system}; [
            tray
            hyprland
            apps
            battery
            bluetooth
            mpris
            cava
            network
            notifd
            powerprofiles
            wireplumber
          ])
          ++ (with pkgs; [
            fish
            typescript
            libnotify
            dart-sass
            fd
            btop
            bluez
            libgtop
            gobject-introspection
            glib
            bluez-tools
            grimblast
            brightnessctl
            gnome-bluetooth
            (python3.withPackages (ps:
              with ps; [
                gpustat
                dbus-python
                pygobject3
              ]))
            matugen
            hyprpicker
            hyprsunset
            hypridle
            wireplumber
            networkmanager
            upower
            gvfs
            swww
            pywal
          ])
          ++ (nixpkgs.lib.optionals (system == "x86_64-linux") [pkgs.gpu-screen-recorder]);
      };
    });

    # Define .overlay to expose the package as pkgs.my-shell based on the system
    overlay = final: prev: {
      my-shell = prev.writeShellScriptBin "my-shell" ''
        if [ "$#" -eq 0 ]; then
            exec ${self.packages.${final.stdenv.system}.default}/bin/my-shell
        else
            exec ${ags.packages.${final.stdenv.system}.io}/bin/astal -i my-shell "$@"
        fi
      '';
    };

    homeManagerModules.my-shell = import ./nix/module.nix self;
  };
}
