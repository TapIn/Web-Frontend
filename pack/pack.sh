#!/bin/bash
echo "Creating pack directory"
rm -rf ../html-compiled
cp -R ../html ../html-compiled
cp -R ../html-compiled/assets/js ../html-compiled/assets/js-inprogress
echo "Compiling files"
node r.js -o deploy-main.js
node r.js -o deploy-mobile.js
sleep 1 # Weird race condition
echo "Compressing files"
java -jar compiler.jar --define='DEBUG=false' --warning_level QUIET --generate_exports --use_types_for_optimization --compilation_level SIMPLE_OPTIMIZATIONS --externs ../html-compiled/assets/js-inprogress/externs/google_maps_api_v3.js --externs ../html-compiled/assets/js-inprogress/externs/jquery-1.7.js --jscomp_off internetExplorerChecks --js ../html-compiled/assets/js-inprogress/tapin-mobile.out.js > ../html-compiled/assets/js/tapin-mobile.min.js
java -jar compiler.jar --define='DEBUG=false' --warning_level QUIET --generate_exports --use_types_for_optimization --compilation_level SIMPLE_OPTIMIZATIONS --externs ../html-compiled/assets/js-inprogress/externs/google_maps_api_v3.js --externs ../html-compiled/assets/js-inprogress/externs/jquery-1.7.js --jscomp_off internetExplorerChecks --js ../html-compiled/assets/js-inprogress/tapin.out.js > ../html-compiled/assets/js/tapin.min.js
#cat ../html-compiled/assets/js-inprogress/tapin-mobile.out.js > ../html-compiled/assets/js/tapin-mobile.min.js
#cat ../html-compiled/assets/js-inprogress/tapin.out.js > ../html-compiled/assets/js/tapin.min.js
sleep 1
echo "Creating packed site version"
rm -rf ../html/assets/js-inprogress
sed -i 's/require-jquery/tapin.min/g' ../html-compiled/index.html
sed -i 's/require-jquery/tapin-mobile.min/g' ../html-compiled/mobile.html