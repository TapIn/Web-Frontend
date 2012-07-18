#!/bin/bash
#echo "Creating pack directory"
rm -rf ../html/assets/js-inprogress
cp -R ../html/assets/js ../html/assets/js-inprogress
echo "Compiling files"
node r.js -o deploy-main.js
node r.js -o deploy-mobile.js
sleep 1 # Weird race condition
echo "Compressing files"
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off internetExplorerChecks --js ../html/assets/js-inprogress/tapin-mobile.out.js > ../html/assets/js/tapin-mobile.min.js
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off internetExplorerChecks --js ../html/assets/js-inprogress/tapin.out.js > ../html/assets/js/tapin.min.js
sleep 1
echo "Creating packed site version"
rm -rf ../html/assets/js-inprogress
cp -r ../html ../html-compiled
rm ../html/assets/js/tapin.min.js
rm ../html/assets/js/tapin-mobile.min.js