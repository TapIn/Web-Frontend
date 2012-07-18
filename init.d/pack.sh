#!/bin/bash
#echo "Creating pack directory"
rm -rf ../html/assets/js-inprogress
rm -rf ../html/assets/js-compiled
cp -R ../html/assets/js ../html/assets/js-inprogress
mkdir ../html/assets/js-compiled
echo "Compiling files"
node r.js -o deploy-main.js
node r.js -o deploy-mobile.js
sleep 1 # Weird race condition
echo "Compressing files"
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off internetExplorerChecks --js ../html/assets/js-inprogress/tapin-mobile.out.js > ../html/assets/js-compiled/tapin-mobile.min.js
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off internetExplorerChecks --js ../html/assets/js-inprogress/tapin.out.js > ../html/assets/js-compiled/tapin.min.js
sleep 1
echo "Creating packed site version"
rm -rf ../html/assets/js-inprogress
cp -r ../html ../html-compiled
rm -rf ../html/assets/js-compiled
rm -rf ../html-compiled/assets/js
mv ../html-compiled/assets/js-compiled ../html-compiled/assets/js